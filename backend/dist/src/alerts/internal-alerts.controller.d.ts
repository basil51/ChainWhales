import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
export declare class InternalAlertsController {
    private readonly alertsService;
    constructor(alertsService: AlertsService);
    create(dto: CreateAlertDto): Promise<{
        score: number;
        id: string;
        createdAt: Date;
        tokenId: string;
        signalStrength: import("@prisma/client").$Enums.SignalStrength;
        deliveryTargets: string[];
        status: import("@prisma/client").$Enums.AlertStatus;
    }>;
}
