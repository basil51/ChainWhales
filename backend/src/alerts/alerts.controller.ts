import { Body, Controller, Get, Post } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  findAll() {
    return this.alertsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateAlertDto) {
    return this.alertsService.create(dto);
  }
}

