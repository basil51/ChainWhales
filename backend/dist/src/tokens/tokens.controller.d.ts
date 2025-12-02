import { FilterTokensDto } from './dto/filter-tokens.dto';
import { CreateTokenDto } from './dto/create-token.dto';
import { TokensService } from './tokens.service';
export declare class TokensController {
    private readonly tokensService;
    constructor(tokensService: TokensService);
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
    create(dto: CreateTokenDto): Promise<{
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
    }>;
}
