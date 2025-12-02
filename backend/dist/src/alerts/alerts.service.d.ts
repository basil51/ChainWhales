import { PrismaService } from '../prisma/prisma.service';
import { TokensService } from '../tokens/tokens.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { AlertsGateway } from './alerts.gateway';
export declare class AlertsService {
    private readonly prisma;
    private readonly tokensService;
    private readonly alertsGateway;
    constructor(prisma: PrismaService, tokensService: TokensService, alertsGateway: AlertsGateway);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        token: {
            symbol: string;
            chain: string;
            riskLevel: import("@prisma/client").$Enums.RiskLevel;
            address: string;
            name: string;
            liquidityUsd: number;
            volumeUsd24h: number;
            holderCount: number;
            score: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        score: number;
        id: string;
        createdAt: Date;
        tokenId: string;
        signalStrength: import("@prisma/client").$Enums.SignalStrength;
        deliveryTargets: string[];
        status: import("@prisma/client").$Enums.AlertStatus;
    })[]>;
    create(dto: CreateAlertDto): Promise<{
        token: {
            symbol: string;
            chain: string;
            riskLevel: import("@prisma/client").$Enums.RiskLevel;
            address: string;
            name: string;
            liquidityUsd: number;
            volumeUsd24h: number;
            holderCount: number;
            score: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        score: number;
        id: string;
        createdAt: Date;
        tokenId: string;
        signalStrength: import("@prisma/client").$Enums.SignalStrength;
        deliveryTargets: string[];
        status: import("@prisma/client").$Enums.AlertStatus;
    }>;
}
