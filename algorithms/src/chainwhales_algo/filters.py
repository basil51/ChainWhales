"""Filter helpers used by the accumulation engine."""

from __future__ import annotations

from typing import Iterable, Sequence

from .config import Thresholds
from .models import TokenSnapshot


def meets_liquidity_requirements(token: TokenSnapshot, thresholds: Thresholds) -> bool:
    return token.liquidity_usd >= thresholds.min_liquidity_usd


def meets_holder_requirements(token: TokenSnapshot, thresholds: Thresholds) -> bool:
    return token.holder_count >= thresholds.min_holder_count


def liquidity_is_stable(token: TokenSnapshot, thresholds: Thresholds) -> bool:
    return token.liquidity_change_pct >= -thresholds.max_liquidity_drop_pct


def contract_is_safe(token: TokenSnapshot) -> bool:
    return token.contract_safety_score >= 0.5


def apply_filters(
    tokens: Sequence[TokenSnapshot],
    thresholds: Thresholds,
) -> list[TokenSnapshot]:
    filtered: list[TokenSnapshot] = []
    for token in tokens:
        if not meets_liquidity_requirements(token, thresholds):
            continue
        if not meets_holder_requirements(token, thresholds):
            continue
        if not liquidity_is_stable(token, thresholds):
            continue
        if not contract_is_safe(token):
            continue
        filtered.append(token)
    return filtered

