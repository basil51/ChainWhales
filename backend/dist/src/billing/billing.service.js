"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var BillingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stripe_1 = __importDefault(require("stripe"));
const prisma_service_1 = require("../prisma/prisma.service");
let BillingService = BillingService_1 = class BillingService {
    configService;
    prisma;
    stripe;
    priceLookup;
    successUrl;
    cancelUrl;
    webhookSecret;
    logger = new common_1.Logger(BillingService_1.name);
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        const secretKey = this.configService.get('app.stripeSecretKey');
        if (secretKey) {
            this.stripe = new stripe_1.default(secretKey, {
                apiVersion: '2025-11-17.clover',
            });
        }
        this.priceLookup = {
            free: '',
            basic: this.configService.get('app.stripePriceBasic') ?? '',
            pro: this.configService.get('app.stripePricePro') ?? '',
            whale: this.configService.get('app.stripePriceWhale') ?? '',
        };
        this.successUrl = this.configService.getOrThrow('app.stripeSuccessUrl');
        this.cancelUrl = this.configService.getOrThrow('app.stripeCancelUrl');
        this.webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET') ?? '';
    }
    async createCheckoutSession(plan, customerEmail) {
        if (!this.stripe) {
            throw new common_1.BadRequestException('Stripe secret key is not configured');
        }
        if (plan === 'free') {
            throw new common_1.BadRequestException('Free plan does not require checkout');
        }
        const priceId = this.priceLookup[plan];
        if (!priceId) {
            throw new common_1.BadRequestException(`Missing Stripe price configuration for ${plan}`);
        }
        if (priceId.startsWith('prod_')) {
            throw new common_1.BadRequestException(`Invalid Stripe price ID for ${plan}: '${priceId}'. ` +
                `You provided a product ID (prod_...), but Stripe checkout requires a price ID (price_...). ` +
                `Find the price ID in Stripe dashboard: Products → [Your Product] → Prices → Copy the Price ID.`);
        }
        if (!priceId.startsWith('price_')) {
            throw new common_1.BadRequestException(`Invalid Stripe price ID format for ${plan}: '${priceId}'. ` +
                `Price IDs must start with 'price_' (e.g., price_1234567890abcdef).`);
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
    async handleWebhook(signature, rawBody) {
        if (!this.stripe)
            return;
        if (!this.webhookSecret) {
            this.logger.error('Missing STRIPE_WEBHOOK_SECRET');
            throw new common_1.BadRequestException('Webhook secret not configured');
        }
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(rawBody, signature, this.webhookSecret);
        }
        catch (err) {
            this.logger.error(`Webhook signature verification failed: ${err.message}`);
            throw new common_1.BadRequestException(`Webhook Error: ${err.message}`);
        }
        switch (event.type) {
            case 'checkout.session.completed':
                await this.handleCheckoutSessionCompleted(event.data.object);
                break;
            case 'customer.subscription.deleted':
                await this.handleSubscriptionDeleted(event.data.object);
                break;
            default:
                this.logger.log(`Unhandled event type ${event.type}`);
        }
    }
    async handleCheckoutSessionCompleted(session) {
        if (session.payment_status !== 'paid')
            return;
        const email = session.customer_email;
        if (!email) {
            this.logger.warn(`Checkout session ${session.id} missing customer_email`);
            return;
        }
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
    async handleSubscriptionDeleted(subscription) {
    }
    getPlanFromPriceId(priceId) {
        if (priceId === this.priceLookup.basic)
            return 'basic';
        if (priceId === this.priceLookup.pro)
            return 'pro';
        if (priceId === this.priceLookup.whale)
            return 'whale';
        return null;
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = BillingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], BillingService);
//# sourceMappingURL=billing.service.js.map