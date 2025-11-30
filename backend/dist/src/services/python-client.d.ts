import { RiskLevel, SignalStrength } from '@prisma/client';
export interface InternalTokenPayload {
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
export interface InternalAlertPayload {
    tokenId: string;
    score: number;
    signalStrength: SignalStrength;
    deliveryTargets: string[];
}
export declare class PythonIntegrationClient {
    private readonly baseUrl;
    constructor(baseUrl?: string);
    createToken(payload: InternalTokenPayload): Promise<unknown>;
    createAlert(payload: InternalAlertPayload): Promise<unknown>;
    private post;
}
