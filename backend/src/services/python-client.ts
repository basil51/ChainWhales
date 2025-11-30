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

export class PythonIntegrationClient {
  private readonly baseUrl: string;

  constructor(baseUrl = process.env.INTERNAL_API_URL ?? 'http://localhost:4000') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async createToken(payload: InternalTokenPayload) {
    return this.post('/internal/tokens', payload);
  }

  async createAlert(payload: InternalAlertPayload) {
    return this.post('/internal/alerts', payload);
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Request failed: ${String(response.status)} ${text}`);
    }

    return (await response.json()) as T;
  }
}

