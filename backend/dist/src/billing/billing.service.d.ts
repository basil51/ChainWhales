import { ConfigService } from '@nestjs/config';
import { Plan } from '@prisma/client';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
export declare class BillingService {
    private readonly configService;
    private readonly prisma;
    private readonly stripe?;
    private readonly priceLookup;
    private readonly successUrl;
    private readonly cancelUrl;
    private readonly webhookSecret;
    private readonly logger;
    constructor(configService: ConfigService, prisma: PrismaService);
    createCheckoutSession(plan: Plan, customerEmail: string): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    handleWebhook(signature: string, rawBody: Buffer): Promise<void>;
    private handleCheckoutSessionCompleted;
    private handleSubscriptionDeleted;
    private getPlanFromPriceId;
}
