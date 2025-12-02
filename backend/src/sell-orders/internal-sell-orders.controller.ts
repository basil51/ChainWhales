import { Body, Controller, Post } from '@nestjs/common';
import { SellOrdersService } from './sell-orders.service';
import { CreateSellOrderDto } from './dto/create-sell-order.dto';
import { CreateLimitOrderDto } from './dto/create-limit-order.dto';

@Controller('internal/sell-orders')
export class InternalSellOrdersController {
  constructor(private readonly sellOrdersService: SellOrdersService) {}

  @Post('market')
  createMarketSell(@Body() dto: CreateSellOrderDto) {
    return this.sellOrdersService.createMarketSell(dto);
  }

  @Post('limit')
  createLimitOrder(@Body() dto: CreateLimitOrderDto) {
    return this.sellOrdersService.createLimitOrder(dto);
  }
}

