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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const tokens_service_1 = require("../tokens/tokens.service");
const alerts_gateway_1 = require("./alerts.gateway");
let AlertsService = class AlertsService {
    prisma;
    tokensService;
    alertsGateway;
    constructor(prisma, tokensService, alertsGateway) {
        this.prisma = prisma;
        this.tokensService = tokensService;
        this.alertsGateway = alertsGateway;
    }
    findAll() {
        return this.prisma.alert.findMany({
            orderBy: { createdAt: 'desc' },
            take: 200,
            include: {
                token: true,
            },
        });
    }
    async create(dto) {
        const token = await this.tokensService.findOne(dto.tokenId);
        if (!token) {
            throw new common_1.NotFoundException(`Token ${dto.tokenId} not found`);
        }
        const alert = await this.prisma.alert.create({
            data: {
                tokenId: token.id,
                score: dto.score,
                signalStrength: dto.signalStrength,
                deliveryTargets: dto.deliveryTargets,
            },
            include: {
                token: true,
            },
        });
        this.alertsGateway.emitNewAlert(alert);
        return alert;
    }
};
exports.AlertsService = AlertsService;
exports.AlertsService = AlertsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tokens_service_1.TokensService,
        alerts_gateway_1.AlertsGateway])
], AlertsService);
//# sourceMappingURL=alerts.service.js.map