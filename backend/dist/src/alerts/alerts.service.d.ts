import { PrismaService } from '../prisma/prisma.service';
import { TokensService } from '../tokens/tokens.service';
import { CreateAlertDto } from './dto/create-alert.dto';
export declare class AlertsService {
    private readonly prisma;
    private readonly tokensService;
    constructor(prisma: PrismaService, tokensService: TokensService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        score: number;
        id: string;
        createdAt: Date;
        tokenId: string;
        signalStrength: import("@prisma/client").$Enums.SignalStrength;
        deliveryTargets: string[];
        status: import("@prisma/client").$Enums.AlertStatus;
    }[]>;
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
