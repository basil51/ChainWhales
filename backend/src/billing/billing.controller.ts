import { Body, Controller, Headers, Post, Req, BadRequestException } from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { Request } from 'express';
import { RawBodyRequest } from '@nestjs/common';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('checkout')
  createCheckout(@Body() dto: CreateCheckoutSessionDto) {
    return this.billingService.createCheckoutSession(dto.plan, dto.customerEmail);
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }
    if (!req.rawBody) {
      throw new BadRequestException('Invalid payload');
    }
    await this.billingService.handleWebhook(signature, req.rawBody);
    return { received: true };
  }
}
