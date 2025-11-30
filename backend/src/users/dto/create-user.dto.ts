import { Plan } from '@prisma/client';
import { IsEmail, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsEnum(Plan)
  plan: Plan;
}

