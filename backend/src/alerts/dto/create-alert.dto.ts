import { SignalStrength } from '@prisma/client';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateAlertDto {
  @IsString()
  @IsNotEmpty()
  tokenId: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;

  @IsEnum(SignalStrength)
  signalStrength: SignalStrength;

  @IsArray()
  @IsString({ each: true })
  deliveryTargets: string[];
}

