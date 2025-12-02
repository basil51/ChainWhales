"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const health_module_1 = require("./health/health.module");
const tokens_module_1 = require("./tokens/tokens.module");
const alerts_module_1 = require("./alerts/alerts.module");
const users_module_1 = require("./users/users.module");
const sell_orders_module_1 = require("./sell-orders/sell-orders.module");
const app_config_1 = __importDefault(require("./common/config/app.config"));
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const billing_module_1 = require("./billing/billing.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                cache: true,
                load: [app_config_1.default],
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            billing_module_1.BillingModule,
            health_module_1.HealthModule,
            tokens_module_1.TokensModule,
            alerts_module_1.AlertsModule,
            users_module_1.UsersModule,
            sell_orders_module_1.SellOrdersModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map