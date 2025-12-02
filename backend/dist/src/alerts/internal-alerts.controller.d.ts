import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
export declare class InternalAlertsController {
    private readonly alertsService;
    constructor(alertsService: AlertsService);
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
