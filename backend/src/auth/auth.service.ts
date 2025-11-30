import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClerkClient, createClerkClient } from '@clerk/clerk-sdk-node';

type ClerkClientWithVerify = ClerkClient & {
  verifyToken(token: string): Promise<unknown>;
};

@Injectable()
export class AuthService {
  private readonly clerkClient?: ClerkClientWithVerify;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('app.clerkSecretKey');
    if (secretKey) {
      this.clerkClient = createClerkClient({
        secretKey,
      });
    }
  }

  async verifyAuthorizationHeader(authorization?: string) {
    if (!this.clerkClient) {
      throw new UnauthorizedException('Clerk secret key is not configured');
    }
    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }
    const token = authorization.replace(/^Bearer\s+/i, '');
    return this.clerkClient.verifyToken(token);
  }
}

