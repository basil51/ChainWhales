import { Plan } from '@prisma/client';
import { IsEmail, IsEnum } from 'class-validator';

export class CreateCheckoutSessionDto {
  @IsEmail()
  customerEmail: string;

  @IsEnum(Plan)
  plan: Plan;
}

