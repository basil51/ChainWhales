import { Body, Controller, Post } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';

@Controller('internal/alerts')
export class InternalAlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  create(@Body() dto: CreateAlertDto) {
    return this.alertsService.create(dto);
  }
}

