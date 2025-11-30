import { Body, Controller, Post } from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('checkout')
  createCheckout(@Body() dto: CreateCheckoutSessionDto) {
    return this.billingService.createCheckoutSession(dto.plan, dto.customerEmail);
  }
}

