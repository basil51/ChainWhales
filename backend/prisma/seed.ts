// @ts-nocheck
import { PrismaClient, RiskLevel, SignalStrength, Plan } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'founder@chainwhales.io' },
    update: {},
    create: {
      email: 'founder@chainwhales.io',
      plan: Plan.pro,
    },
  });

  const token = await prisma.token.upsert({
    where: { address: 'So11111111111111111111111111111111111111112' },
    update: {},
    create: {
      address: 'So11111111111111111111111111111111111111112',
      name: 'Solana',
      symbol: 'SOL',
      chain: 'solana',
      liquidityUsd: 250_000,
      volumeUsd24h: 1_200_000,
      holderCount: 100_000,
      score: 85,
      riskLevel: RiskLevel.low,
    },
  });

  await prisma.alert.create({
    data: {
      tokenId: token.id,
      score: 87,
      signalStrength: SignalStrength.high,
      deliveryTargets: ['websocket', 'email'],
    },
  });

  console.log(`Seed completed. User=${user.email}, Token=${token.symbol}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

