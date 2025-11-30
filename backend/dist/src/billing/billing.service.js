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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stripe_1 = __importDefault(require("stripe"));
let BillingService = class BillingService {
    configService;
    stripe;
    priceLookup;
    successUrl;
    cancelUrl;
    constructor(configService) {
        this.configService = configService;
        const secretKey = this.configService.get('app.stripeSecretKey');
        if (secretKey) {
            this.stripe = new stripe_1.default(secretKey);
        }
        this.priceLookup = {
            free: '',
            basic: this.configService.get('app.stripePriceBasic') ?? '',
            pro: this.configService.get('app.stripePricePro') ?? '',
            whale: this.configService.get('app.stripePriceWhale') ?? '',
        };
        this.successUrl = this.configService.getOrThrow('app.stripeSuccessUrl');
        this.cancelUrl = this.configService.getOrThrow('app.stripeCancelUrl');
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
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], BillingService);
//# sourceMappingURL=billing.service.js.map