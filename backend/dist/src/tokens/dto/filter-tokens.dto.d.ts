import { RiskLevel } from '@prisma/client';
export declare class FilterTokensDto {
    chain?: string;
    minScore?: number;
    maxScore?: number;
    riskLevel?: RiskLevel;
}
