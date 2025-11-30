import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { FilterTokensDto } from './dto/filter-tokens.dto';
import { CreateTokenDto } from './dto/create-token.dto';
import { TokensService } from './tokens.service';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Get()
  findAll(@Query() filters: FilterTokensDto) {
    return this.tokensService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tokensService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateTokenDto) {
    return this.tokensService.create(dto);
  }
}

