import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
export declare class AlertsController {
    private readonly alertsService;
    constructor(alertsService: AlertsService);
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
