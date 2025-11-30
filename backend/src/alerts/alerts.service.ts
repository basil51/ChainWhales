import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TokensService } from '../tokens/tokens.service';
import { CreateAlertDto } from './dto/create-alert.dto';

@Injectable()
export class AlertsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokensService: TokensService,
  ) {}

  findAll() {
    return this.prisma.alert.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async create(dto: CreateAlertDto) {
    const token = await this.tokensService.findOne(dto.tokenId);
    if (!token) {
      throw new NotFoundException(`Token ${dto.tokenId} not found`);
    }
    return this.prisma.alert.create({
      data: {
        tokenId: token.id,
        score: dto.score,
        signalStrength: dto.signalStrength,
        deliveryTargets: dto.deliveryTargets,
      },
    });
  }
}

