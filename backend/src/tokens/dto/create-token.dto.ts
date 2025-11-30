import { RiskLevel } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateTokenDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsString()
  @IsNotEmpty()
  chain: string;

  @IsNumber()
  @Min(0)
  liquidityUsd: number;

  @IsNumber()
  @Min(0)
  volumeUsd24h: number;

  @IsNumber()
  @Min(0)
  holderCount: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;

  @IsEnum(RiskLevel)
  riskLevel: RiskLevel;
}

