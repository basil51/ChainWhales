import { Module } from '@nestjs/common';
import { SellOrdersService } from './sell-orders.service';
import { SellOrdersController } from './sell-orders.controller';
import { InternalSellOrdersController } from './internal-sell-orders.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [PrismaModule, TokensModule],
  controllers: [SellOrdersController, InternalSellOrdersController],
  providers: [SellOrdersService],
  exports: [SellOrdersService],
})
export class SellOrdersModule {}

