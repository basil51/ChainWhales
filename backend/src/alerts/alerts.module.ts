import { Module } from '@nestjs/common';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { TokensModule } from '../tokens/tokens.module';
import { InternalAlertsController } from './internal-alerts.controller';
import { AlertsGateway } from './alerts.gateway';

@Module({
  imports: [TokensModule],
  controllers: [AlertsController, InternalAlertsController],
  providers: [AlertsService, AlertsGateway],
  exports: [AlertsGateway],
})
export class AlertsModule {}

