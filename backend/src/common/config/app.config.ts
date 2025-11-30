import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT ?? '4000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  corsOrigin: process.env.APP_CORS_ORIGIN ?? '*',
  databaseUrl: process.env.DATABASE_URL ?? '',
  redisUrl: process.env.REDIS_URL ?? '',
  bitqueryApiKey: process.env.BITQUERY_API_KEY ?? '',
  clerkSecretKey: process.env.CLERK_SECRET_KEY ?? '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? '',
  stripePriceBasic: process.env.STRIPE_PRICE_BASIC ?? '',
  stripePricePro: process.env.STRIPE_PRICE_PRO ?? '',
  stripePriceWhale: process.env.STRIPE_PRICE_WHALE ?? '',
  stripeSuccessUrl: process.env.STRIPE_SUCCESS_URL ?? 'https://chainwhales.io/app/success',
  stripeCancelUrl: process.env.STRIPE_CANCEL_URL ?? 'https://chainwhales.io/app/cancel',
}));

