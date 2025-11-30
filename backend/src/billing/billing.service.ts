import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Plan } from '@prisma/client';
import Stripe from 'stripe';

@Injectable()
export class BillingService {
  private readonly stripe?: Stripe;
  private readonly priceLookup: Record<Plan, string>;
  private readonly successUrl: string;
  private readonly cancelUrl: string;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('app.stripeSecretKey');
    if (secretKey) {
      this.stripe = new Stripe(secretKey);
    }
    this.priceLookup = {
      free: '',
      basic: this.configService.get<string>('app.stripePriceBasic') ?? '',
      pro: this.configService.get<string>('app.stripePricePro') ?? '',
      whale: this.configService.get<string>('app.stripePriceWhale') ?? '',
    };
    this.successUrl = this.configService.getOrThrow<string>('app.stripeSuccessUrl');
    this.cancelUrl = this.configService.getOrThrow<string>('app.stripeCancelUrl');
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
}

