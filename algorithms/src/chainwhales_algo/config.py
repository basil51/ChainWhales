"""Typed configuration model for the accumulation engine."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import timedelta
from typing import Any, Mapping, Sequence


@dataclass(frozen=True)
class Thresholds:
    min_liquidity_usd: float = 50_000
    min_holder_count: int = 100
    max_liquidity_drop_pct: float = 50.0
    min_score: int = 70


@dataclass(frozen=True)
class WeightConfig:
    whale_volume: float = 0.30
    holder_growth: float = 0.25
    liquidity_change: float = 0.20
    momentum: float = 0.15
    contract_safety: float = 0.10

    def normalize(self) -> "WeightConfig":
        total = (
            self.whale_volume
            + self.holder_growth
            + self.liquidity_change
            + self.momentum
            + self.contract_safety
        )
        if abs(total - 1.0) < 1e-9:
            return self
        factor = 1 / total if total else 0
        return WeightConfig(
            whale_volume=self.whale_volume * factor,
            holder_growth=self.holder_growth * factor,
            liquidity_change=self.liquidity_change * factor,
            momentum=self.momentum * factor,
            contract_safety=self.contract_safety * factor,
        )


@dataclass(frozen=True)
class DataSourceConfig:
    # BitQuery v2 GraphQL endpoint (OAuth tokens as per docs)
    # See: https://docs.bitquery.io/docs/authorisation/how-to-generate/
    api_url: str = "https://streaming.bitquery.io/graphql"
    api_key: str | None = None
    # BitQuery can be slow, especially on Solana; use a generous default timeout.
    timeout_seconds: float = 60.0
    retries: int = 3
    backoff_seconds: float = 2.0


@dataclass(frozen=True)
class EngineConfig:
    chain: str = "solana"
    lookback: timedelta = timedelta(minutes=30)
    scoring_weights: WeightConfig = field(default_factory=WeightConfig)
    thresholds: Thresholds = field(default_factory=Thresholds)
    batch_size: int = 50
    dry_run: bool = False
    extra: Mapping[str, Any] | None = None


@dataclass(frozen=True)
class BacktestRange:
    start_block: int
    end_block: int
    chains: Sequence[str]

