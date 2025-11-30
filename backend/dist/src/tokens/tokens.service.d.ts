import { PrismaService } from '../prisma/prisma.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { FilterTokensDto } from './dto/filter-tokens.dto';
export declare class TokensService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(filters: FilterTokensDto): import("@prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
    create(dto: CreateTokenDto): import("@prisma/client").Prisma.Prisma__TokenClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__TokenClient<{
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
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
}
