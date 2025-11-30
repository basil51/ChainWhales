import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private readonly configService;
    private readonly clerkClient?;
    constructor(configService: ConfigService);
    verifyAuthorizationHeader(authorization?: string): Promise<unknown>;
}
