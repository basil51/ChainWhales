import { ConfigService } from '@nestjs/config';
import { Plan } from '@prisma/client';
import Stripe from 'stripe';
export declare class BillingService {
    private readonly configService;
    private readonly stripe?;
    private readonly priceLookup;
    private readonly successUrl;
    private readonly cancelUrl;
    constructor(configService: ConfigService);
    createCheckoutSession(plan: Plan, customerEmail: string): Promise<Stripe.Response<Stripe.Checkout.Session>>;
}
