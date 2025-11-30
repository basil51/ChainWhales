import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { FilterTokensDto } from './dto/filter-tokens.dto';

@Injectable()
export class TokensService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(filters: FilterTokensDto) {
    return this.prisma.token.findMany({
      where: {
        ...(filters.chain ? { chain: filters.chain } : {}),
        ...(filters.riskLevel ? { riskLevel: filters.riskLevel } : {}),
        ...(filters.minScore !== undefined || filters.maxScore !== undefined
          ? {
              score: {
                ...(filters.minScore !== undefined ? { gte: filters.minScore } : {}),
                ...(filters.maxScore !== undefined ? { lte: filters.maxScore } : {}),
              },
            }
          : {}),
      },
      orderBy: { updatedAt: 'desc' },
      take: 200,
    });
  }

  create(dto: CreateTokenDto) {
    return this.prisma.token.create({
      data: {
        address: dto.address,
        name: dto.name,
        symbol: dto.symbol,
        chain: dto.chain,
        liquidityUsd: dto.liquidityUsd,
        volumeUsd24h: dto.volumeUsd24h,
        holderCount: dto.holderCount,
        score: dto.score,
        riskLevel: dto.riskLevel,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.token.findUnique({
      where: { id },
    });
  }
}

