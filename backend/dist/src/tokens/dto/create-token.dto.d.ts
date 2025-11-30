import { RiskLevel } from '@prisma/client';
export declare class CreateTokenDto {
    address: string;
    name: string;
    symbol: string;
    chain: string;
    liquidityUsd: number;
    volumeUsd24h: number;
    holderCount: number;
    score: number;
    riskLevel: RiskLevel;
}
