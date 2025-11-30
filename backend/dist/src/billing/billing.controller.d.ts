import { BillingService } from './billing.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
export declare class BillingController {
    private readonly billingService;
    constructor(billingService: BillingService);
    createCheckout(dto: CreateCheckoutSessionDto): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Checkout.Session>>;
}
