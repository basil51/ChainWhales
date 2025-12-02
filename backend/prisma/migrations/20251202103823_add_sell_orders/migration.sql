-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('active', 'inactive', 'executed', 'canceled');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('market', 'limit');

-- CreateTable
CREATE TABLE "SellOrder" (
    "id" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "volumeUsd" DOUBLE PRECISION NOT NULL,
    "tokenAmount" DOUBLE PRECISION NOT NULL,
    "priceUsd" DOUBLE PRECISION NOT NULL,
    "orderType" "OrderType" NOT NULL DEFAULT 'market',
    "status" "OrderStatus" NOT NULL DEFAULT 'executed',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SellOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LimitOrder" (
    "id" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,
    "orderId" TEXT,
    "targetPriceUsd" DOUBLE PRECISION NOT NULL,
    "tokenAmount" DOUBLE PRECISION NOT NULL,
    "orderType" "OrderType" NOT NULL DEFAULT 'limit',
    "status" "OrderStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LimitOrder_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SellOrder" ADD CONSTRAINT "SellOrder_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LimitOrder" ADD CONSTRAINT "LimitOrder_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
