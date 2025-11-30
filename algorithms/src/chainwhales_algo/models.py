"""Core data structures for the accumulation engine."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Sequence


@dataclass(frozen=True)
class WhaleTransaction:
    tx_hash: str
    wallet: str
    volume_usd: float
    token_amount: float
    timestamp: datetime


@dataclass(frozen=True)
class TokenSnapshot:
    address: str
    symbol: str
    name: str
    chain: str
    liquidity_usd: float
    holder_count: int
    price_usd: float
    volume_usd_24h: float
    liquidity_change_pct: float
    holder_growth_pct: float
    whale_transactions: Sequence[WhaleTransaction]
    contract_safety_score: float


@dataclass(frozen=True)
class ScoreBreakdown:
    whale_volume: float
    holder_growth: float
    liquidity_change: float
    momentum: float
    contract_safety: float

    @property
    def total(self) -> float:
        return (
            self.whale_volume
            + self.holder_growth
            + self.liquidity_change
            + self.momentum
            + self.contract_safety
        )


@dataclass(frozen=True)
class AlertSignal:
    token: TokenSnapshot
    breakdown: ScoreBreakdown
    score: float
    triggered_at: datetime

