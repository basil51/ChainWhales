import { CreateTokenDto } from './dto/create-token.dto';
import { TokensService } from './tokens.service';
export declare class InternalTokensController {
    private readonly tokensService;
    constructor(tokensService: TokensService);
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
