import { SignalStrength } from '@prisma/client';
export declare class CreateAlertDto {
    tokenId: string;
    score: number;
    signalStrength: SignalStrength;
    deliveryTargets: string[];
}
