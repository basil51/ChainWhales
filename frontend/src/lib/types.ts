export type RiskLevel = "low" | "medium" | "high";
export type SignalStrength = "medium" | "high";

export interface Token {
  id: string;
  address: string;
  name: string;
  symbol: string;
  chain: string;
  liquidityUsd: number;
  volumeUsd24h: number;
  holderCount: number;
  score: number;
  riskLevel: RiskLevel;
  updatedAt?: string;
}

export interface Alert {
  id: string;
  tokenId: string;
  score: number;
  signalStrength: SignalStrength;
  status: "pending" | "sent";
  deliveryTargets: string[];
  createdAt: string;
  token?: Token;
}

