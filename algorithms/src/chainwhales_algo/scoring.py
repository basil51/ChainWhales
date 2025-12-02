"""Scoring helpers."""

from __future__ import annotations

from .config import WeightConfig
from .models import ScoreBreakdown, TokenSnapshot


def _normalize(value: float, max_value: float) -> float:
    if max_value <= 0:
        return 0
    return max(0.0, min(1.0, value / max_value))


def score_token(token: TokenSnapshot, weights: WeightConfig) -> ScoreBreakdown:
    # Lowered thresholds for MVP/Testing sensitivity
    whale_volume_component = _normalize(
        sum(tx.volume_usd for tx in token.whale_transactions),
        max_value=50_000,  # Was 500,000
    ) * weights.whale_volume * 100
    holder_growth_component = _normalize(
        token.holder_growth_pct,
        max_value=100,
    ) * weights.holder_growth * 100
    liquidity_component = _normalize(
        token.liquidity_change_pct,
        max_value=50,
    ) * weights.liquidity_change * 100
    momentum_component = _normalize(
        token.volume_usd_24h,
        max_value=100_000,  # Was 1,000,000
    ) * weights.momentum * 100
    safety_component = token.contract_safety_score * weights.contract_safety * 100
    return ScoreBreakdown(
        whale_volume=whale_volume_component,
        holder_growth=holder_growth_component,
        liquidity_change=liquidity_component,
        momentum=momentum_component,
        contract_safety=safety_component,
    )

