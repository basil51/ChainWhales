"""High level orchestration for a single accumulation scan."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Protocol, Sequence

from .config import EngineConfig
from .data_sources import BitQueryClient
from .filters import apply_filters
from .models import AlertSignal
from .scoring import score_token


class AlertSink(Protocol):
    def handle_alert(self, alert: AlertSignal) -> None:
        ...


class AccumulationEngine:
    def __init__(
        self,
        config: EngineConfig,
        data_source: BitQueryClient,
        sinks: Sequence[AlertSink] | None = None,
    ) -> None:
        self._config = config
        self._data_source = data_source
        self._sinks = list(sinks or [])

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
            self._dispatch(alerts[-1])
        return alerts

    def _dispatch(self, alert: AlertSignal) -> None:
        for sink in self._sinks:
            sink.handle_alert(alert)

