import { Body, Controller, Post } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { TokensService } from './tokens.service';

@Controller('internal/tokens')
export class InternalTokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Post()
  create(@Body() dto: CreateTokenDto) {
    return this.tokensService.create(dto);
  }
}

