import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateSellOrderDto {
  @IsString()
  @IsNotEmpty()
  tokenId: string;

  @IsString()
  @IsNotEmpty()
  wallet: string;

  @IsString()
  @IsNotEmpty()
  txHash: string;

  @IsNumber()
  @Min(0)
  volumeUsd: number;

  @IsNumber()
  @Min(0)
  tokenAmount: number;

  @IsNumber()
  @Min(0)
  priceUsd: number;
}

