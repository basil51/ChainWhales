import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class CreateLimitOrderDto {
  @IsString()
  @IsNotEmpty()
  tokenId: string;

  @IsString()
  @IsNotEmpty()
  wallet: string;

  @IsString()
  @IsOptional()
  orderId?: string;

  @IsNumber()
  @Min(0)
  targetPriceUsd: number;

  @IsNumber()
  @Min(0)
  tokenAmount: number;

  @IsEnum(['active', 'inactive', 'executed', 'canceled'])
  @IsOptional()
  status?: OrderStatus;
}

