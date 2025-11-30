import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { TokensModule } from './tokens/tokens.module';
import { AlertsModule } from './alerts/alerts.module';
import { UsersModule } from './users/users.module';
import appConfig from './common/config/app.config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BillingModule } from './billing/billing.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig],
    }),
    PrismaModule,
    AuthModule,
    BillingModule,
    HealthModule,
    TokensModule,
    AlertsModule,
    UsersModule,
  ],
})
export class AppModule {}

