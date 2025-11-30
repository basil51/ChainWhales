import { Module } from '@nestjs/common';
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';
import { InternalTokensController } from './internal-tokens.controller';

@Module({
  controllers: [TokensController, InternalTokensController],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}

