"""Simple CLI to run the accumulation engine once."""

from __future__ import annotations

import argparse
import os
from dataclasses import replace
from datetime import timedelta

import yaml

from ..config import DataSourceConfig, EngineConfig, Thresholds, WeightConfig
from ..data_sources import BitQueryClient
from ..engine import AccumulationEngine


def load_config(path: str | None) -> EngineConfig:
    if not path:
        return EngineConfig()
    with open(path, "r", encoding="utf-8") as fp:
        raw = yaml.safe_load(fp)
    thresholds = raw.get("thresholds", {})
    weights = raw.get("weights", {})
    cfg = EngineConfig(
        chain=raw.get("chain", "solana"),
        lookback=timedelta(
            minutes=int(raw.get("lookback_minutes", 30)),
        ),
        thresholds=Thresholds(
            min_liquidity_usd=thresholds.get("min_liquidity_usd", 50_000),
            min_holder_count=thresholds.get("min_holder_count", 100),
            max_liquidity_drop_pct=thresholds.get("max_liquidity_drop_pct", 50),
            min_score=thresholds.get("min_score", 70),
        ),
        scoring_weights=WeightConfig(
            whale_volume=weights.get("whale_volume", 0.30),
            holder_growth=weights.get("holder_growth", 0.25),
            liquidity_change=weights.get("liquidity_change", 0.20),
            momentum=weights.get("momentum", 0.15),
            contract_safety=weights.get("contract_safety", 0.10),
        ),
        batch_size=raw.get("batch_size", 50),
        dry_run=raw.get("dry_run", False),
    )
    return cfg


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", help="Path to YAML config", default=None)
    args = parser.parse_args()

    engine_cfg = load_config(args.config)
    data_cfg = DataSourceConfig(
        api_key=os.environ.get("BITQUERY_API_KEY"),
    )
    client = BitQueryClient(data_cfg)

    engine = AccumulationEngine(engine_cfg, client)
    alerts = engine.run_once()
    if not alerts:
        print("No alerts generated.")
        return
    for alert in alerts:
        token = alert.token
        print(
            f"{token.symbol} ({token.address}) "
            f"score={alert.score:.2f} "
            f"liquidity=${token.liquidity_usd:,.0f} "
            f"holders={token.holder_count}"
        )


if __name__ == "__main__":
    main()

