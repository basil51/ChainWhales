import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Plan } from '@prisma/client';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BillingService {
  private readonly stripe?: Stripe;
  private readonly priceLookup: Record<Plan, string>;
  private readonly successUrl: string;
  private readonly cancelUrl: string;
  private readonly webhookSecret: string;
  private readonly logger = new Logger(BillingService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const secretKey = this.configService.get<string>('app.stripeSecretKey');
    if (secretKey) {
      this.stripe = new Stripe(secretKey, {
        apiVersion: '2024-10-28.acacia', // Use a valid recent version or 'latest' if possible, but strict typing requires exact match
      });
    }
    this.priceLookup = {
      free: '',
      basic: this.configService.get<string>('app.stripePriceBasic') ?? '',
      pro: this.configService.get<string>('app.stripePricePro') ?? '',
      whale: this.configService.get<string>('app.stripePriceWhale') ?? '',
    };
    this.successUrl = this.configService.getOrThrow<string>('app.stripeSuccessUrl');
    this.cancelUrl = this.configService.getOrThrow<string>('app.stripeCancelUrl');
    this.webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET') ?? '';
  }

  async createCheckoutSession(plan: Plan, customerEmail: string) {
    if (!this.stripe) {
      throw new BadRequestException('Stripe secret key is not configured');
    }
    if (plan === 'free') {
      throw new BadRequestException('Free plan does not require checkout');
    }
    const priceId = this.priceLookup[plan];
    if (!priceId) {
      throw new BadRequestException(`Missing Stripe price configuration for ${plan}`);
    }
    // Validate that it's a price ID, not a product ID
    if (priceId.startsWith('prod_')) {
      throw new BadRequestException(
        `Invalid Stripe price ID for ${plan}: '${priceId}'. ` +
        `You provided a product ID (prod_...), but Stripe checkout requires a price ID (price_...). ` +
        `Find the price ID in Stripe dashboard: Products → [Your Product] → Prices → Copy the Price ID.`
      );
    }
    if (!priceId.startsWith('price_')) {
      throw new BadRequestException(
        `Invalid Stripe price ID format for ${plan}: '${priceId}'. ` +
        `Price IDs must start with 'price_' (e.g., price_1234567890abcdef).`
      );
    }
    return this.stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: customerEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: this.successUrl,
      cancel_url: this.cancelUrl,
    });
  }

  async handleWebhook(signature: string, rawBody: Buffer) {
    if (!this.stripe) return;
    if (!this.webhookSecret) {
      this.logger.error('Missing STRIPE_WEBHOOK_SECRET');
      throw new BadRequestException('Webhook secret not configured');
    }

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, this.webhookSecret);
    } catch (err: any) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      default:
        this.logger.log(`Unhandled event type ${event.type}`);
    }
  }

  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    if (session.payment_status !== 'paid') return;

    const email = session.customer_email;
    if (!email) {
      this.logger.warn(`Checkout session ${session.id} missing customer_email`);
      return;
    }

    // Retrieve line items to find which plan was purchased
    const lineItems = await this.stripe?.checkout.sessions.listLineItems(session.id);
    const priceId = lineItems?.data[0]?.price?.id;

    if (!priceId) {
      this.logger.warn(`No price ID found in session ${session.id}`);
      return;
    }

    const plan = this.getPlanFromPriceId(priceId);
    if (!plan) {
      this.logger.warn(`Unknown price ID ${priceId}`);
      return;
    }

    this.logger.log(`Upgrading user ${email} to plan ${plan}`);
    await this.prisma.user.upsert({
      where: { email },
      create: { email, plan },
      update: { plan },
    });
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    // In a real app, you might want to verify which customer this is by querying Stripe
    // For MVP, we might skip if we don't store customer ID.
    // But getting customer email from subscription object requires expanding 'customer'
    // or fetching customer.
    // For now, we'll rely on the fact that users exist.
    // This is a simplified implementation.
  }

  private getPlanFromPriceId(priceId: string): Plan | null {
    if (priceId === this.priceLookup.basic) return 'basic';
    if (priceId === this.priceLookup.pro) return 'pro';
    if (priceId === this.priceLookup.whale) return 'whale';
    return null;
  }
}
