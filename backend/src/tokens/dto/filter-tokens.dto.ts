import { RiskLevel } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class FilterTokensDto {
  @IsOptional()
  @IsString()
  chain?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minScore?: number;

  @IsOptional()
  @IsNumber()
  @Max(100)
  maxScore?: number;

  @IsOptional()
  @IsEnum(RiskLevel)
  riskLevel?: RiskLevel;
}

