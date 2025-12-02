import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TokensService } from '../tokens/tokens.service';
import { CreateSellOrderDto } from './dto/create-sell-order.dto';
import { CreateLimitOrderDto } from './dto/create-limit-order.dto';

@Injectable()
export class SellOrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokensService: TokensService,
  ) {}

  async findAllMarketSells(limit: number = 200) {
    return this.prisma.sellOrder.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        token: true,
      },
    });
  }

  async findAllLimitOrders(limit: number = 200) {
    return this.prisma.limitOrder.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        token: true,
      },
    });
  }

  async createMarketSell(dto: CreateSellOrderDto) {
    const token = await this.tokensService.findOne(dto.tokenId);
    if (!token) {
      throw new NotFoundException(`Token ${dto.tokenId} not found`);
    }

    return this.prisma.sellOrder.create({
      data: {
        tokenId: token.id,
        wallet: dto.wallet,
        txHash: dto.txHash,
        volumeUsd: dto.volumeUsd,
        tokenAmount: dto.tokenAmount,
        priceUsd: dto.priceUsd,
        orderType: 'market',
        status: 'executed',
      },
      include: {
        token: true,
      },
    });
  }

  async createLimitOrder(dto: CreateLimitOrderDto) {
    const token = await this.tokensService.findOne(dto.tokenId);
    if (!token) {
      throw new NotFoundException(`Token ${dto.tokenId} not found`);
    }

    return this.prisma.limitOrder.create({
      data: {
        tokenId: token.id,
        wallet: dto.wallet,
        orderId: dto.orderId,
        targetPriceUsd: dto.targetPriceUsd,
        tokenAmount: dto.tokenAmount,
        orderType: 'limit',
        status: dto.status || 'active',
      },
      include: {
        token: true,
      },
    });
  }

  async updateLimitOrderStatus(orderId: string, status: 'active' | 'inactive' | 'executed' | 'canceled') {
    return this.prisma.limitOrder.update({
      where: { id: orderId },
      data: { status },
    });
  }
}

