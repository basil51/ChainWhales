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
exports.TokensService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TokensService = class TokensService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(filters) {
        return this.prisma.token.findMany({
            where: {
                ...(filters.chain ? { chain: filters.chain } : {}),
                ...(filters.riskLevel ? { riskLevel: filters.riskLevel } : {}),
                ...(filters.minScore !== undefined || filters.maxScore !== undefined
                    ? {
                        score: {
                            ...(filters.minScore !== undefined ? { gte: filters.minScore } : {}),
                            ...(filters.maxScore !== undefined ? { lte: filters.maxScore } : {}),
                        },
                    }
                    : {}),
            },
            orderBy: { updatedAt: 'desc' },
            take: 200,
        });
    }
    create(dto) {
        return this.prisma.token.create({
            data: {
                address: dto.address,
                name: dto.name,
                symbol: dto.symbol,
                chain: dto.chain,
                liquidityUsd: dto.liquidityUsd,
                volumeUsd24h: dto.volumeUsd24h,
                holderCount: dto.holderCount,
                score: dto.score,
                riskLevel: dto.riskLevel,
            },
        });
    }
    findOne(id) {
        return this.prisma.token.findUnique({
            where: { id },
        });
    }
};
exports.TokensService = TokensService;
exports.TokensService = TokensService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TokensService);
//# sourceMappingURL=tokens.service.js.map