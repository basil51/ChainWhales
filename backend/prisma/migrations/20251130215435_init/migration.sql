-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "SignalStrength" AS ENUM ('medium', 'high');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('pending', 'sent');

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('free', 'basic', 'pro', 'whale');

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "chain" TEXT NOT NULL,
    "liquidityUsd" DOUBLE PRECISION NOT NULL,
    "volumeUsd24h" DOUBLE PRECISION NOT NULL,
    "holderCount" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "riskLevel" "RiskLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "signalStrength" "SignalStrength" NOT NULL,
    "status" "AlertStatus" NOT NULL DEFAULT 'pending',
    "deliveryTargets" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "plan" "Plan" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_address_key" ON "Token"("address");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
