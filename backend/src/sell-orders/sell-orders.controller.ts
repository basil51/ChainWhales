import { Controller, Get, Query } from '@nestjs/common';
import { SellOrdersService } from './sell-orders.service';

@Controller('sell-orders')
export class SellOrdersController {
  constructor(private readonly sellOrdersService: SellOrdersService) {}

  @Get('market')
  findAllMarketSells(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 200;
    return this.sellOrdersService.findAllMarketSells(limitNum);
  }

  @Get('limit')
  findAllLimitOrders(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 200;
    return this.sellOrdersService.findAllLimitOrders(limitNum);
  }
}

