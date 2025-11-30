"""High level orchestration for a single accumulation scan."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Sequence

from .config import EngineConfig
from .data_sources import BitQueryClient
from .filters import apply_filters
from .models import AlertSignal, ScoreBreakdown, TokenSnapshot
from .scoring import score_token


class AccumulationEngine:
    def __init__(
        self,
        config: EngineConfig,
        data_source: BitQueryClient,
    ) -> None:
        self._config = config
        self._data_source = data_source

    def run_once(self) -> Sequence[AlertSignal]:
        snapshots = self._data_source.fetch_recent_snapshots(
            engine_cfg=self._config,
            limit=self._config.batch_size,
        )
        eligible = apply_filters(snapshots, self._config.thresholds)
        weights = self._config.scoring_weights.normalize()
        alerts: list[AlertSignal] = []
        for token in eligible:
            breakdown = score_token(token, weights)
            total = breakdown.total
            if total < self._config.thresholds.min_score:
                continue
            alerts.append(
                AlertSignal(
                    token=token,
                    breakdown=breakdown,
                    score=total,
                    triggered_at=datetime.now(tz=timezone.utc),
                )
            )
        return alerts

