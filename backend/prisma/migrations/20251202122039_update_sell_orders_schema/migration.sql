-- AlterTable
ALTER TABLE "LimitOrder" ADD COLUMN     "amountUsd" DOUBLE PRECISION,
ADD COLUMN     "canceledAt" TIMESTAMP(3),
ADD COLUMN     "filledAt" TIMESTAMP(3),
ADD COLUMN     "source" TEXT;

-- AlterTable
ALTER TABLE "SellOrder" ADD COLUMN     "liquidityUsd" DOUBLE PRECISION,
ADD COLUMN     "poolAddress" TEXT,
ADD COLUMN     "source" TEXT;

-- CreateIndex
CREATE INDEX "LimitOrder_tokenId_idx" ON "LimitOrder"("tokenId");

-- CreateIndex
CREATE INDEX "LimitOrder_status_idx" ON "LimitOrder"("status");

-- CreateIndex
CREATE INDEX "LimitOrder_wallet_idx" ON "LimitOrder"("wallet");

-- CreateIndex
CREATE INDEX "SellOrder_tokenId_idx" ON "SellOrder"("tokenId");

-- CreateIndex
CREATE INDEX "SellOrder_createdAt_idx" ON "SellOrder"("createdAt");
