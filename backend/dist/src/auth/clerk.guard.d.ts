import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from './auth.service';
export declare class ClerkAuthGuard implements CanActivate {
    private readonly authService;
    constructor(authService: AuthService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
