import { BillingService } from './billing.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { Request } from 'express';
import { RawBodyRequest } from '@nestjs/common';
export declare class BillingController {
    private readonly billingService;
    constructor(billingService: BillingService);
    createCheckout(dto: CreateCheckoutSessionDto): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Checkout.Session>>;
    handleWebhook(signature: string, req: RawBodyRequest<Request>): Promise<{
        received: boolean;
    }>;
}
