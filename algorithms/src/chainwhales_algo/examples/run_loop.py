"""Continuous loop runner for the accumulation engine.

This script is intended for Phase 1+ where we want the Python engine to
continuously push alerts into the NestJS internal API.

It reuses the same BitQuery client and InternalApiSink across iterations
so connections are kept warm, and waits a configurable interval between
scans.
"""

from __future__ import annotations

import argparse
import os
import sys
import time
from datetime import UTC, datetime

from ..config import DataSourceConfig
from ..data_sources import BitQueryClient
from ..engine import AccumulationEngine
from ..sinks.internal_api import InternalApiSink
from .run_once import load_config


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run the accumulation engine in a loop.")
    parser.add_argument("--config", help="Path to YAML config", default=None)
    parser.add_argument(
        "--push-url",
        help=(
            "Optional base URL for the NestJS internal API. "
            "Falls back to INTERNAL_API_BASE_URL env var, then http://localhost:4000."
        ),
        default=None,
    )
    parser.add_argument(
        "--interval-seconds",
        type=int,
        default=600,
        help="Interval between scans in seconds (default: 600 = 10 minutes).",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    engine_cfg = load_config(args.config)
    timeout = float(os.environ.get("BITQUERY_TIMEOUT_SECONDS", "60"))
    data_cfg = DataSourceConfig(
        api_key=os.environ.get("BITQUERY_API_KEY"),
        timeout_seconds=timeout,
    )
    if not data_cfg.api_key:
        print("ERROR: BITQUERY_API_KEY is not set in the environment.", file=sys.stderr)
        sys.exit(1)

    base_url = (
        args.push_url
        or os.environ.get("INTERNAL_API_BASE_URL")
        or "http://localhost:4000"
    )

    client = BitQueryClient(data_cfg)
    sink = InternalApiSink(base_url=base_url)
    engine = AccumulationEngine(engine_cfg, client, sinks=[sink])

    try:
        start_ts = datetime.now(UTC).isoformat()
        print(
            f"[{start_ts}] "
            f"Starting accumulation loop: interval={args.interval_seconds}s, "
            f"backend={base_url}, chain={engine_cfg.chain}"
        )
        while True:
            started_at = datetime.now(UTC)
            try:
                alerts = engine.run_once()
                count = len(alerts)
                print(
                    f"[{started_at.isoformat()}] Scan complete, "
                    f"generated {count} alert(s)."
                )
            except Exception as exc:  # noqa: BLE001
                print(
                    f"[{started_at.isoformat()}] Scan failed with error: {exc}",
                    file=sys.stderr,
                )

            time.sleep(max(1, args.interval_seconds))
    except KeyboardInterrupt:
        print("\nStopping accumulation loop.")
    finally:
        sink.close()
        client.close()


if __name__ == "__main__":
    main()


