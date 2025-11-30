"""Lightweight BitQuery GraphQL wrapper."""

from __future__ import annotations

import json
from datetime import datetime, timedelta, timezone
from typing import Iterable, Sequence

import httpx
from tenacity import RetryError, retry, stop_after_attempt, wait_fixed

from ..config import DataSourceConfig, EngineConfig
from ..models import TokenSnapshot, WhaleTransaction


ACCUMULATION_QUERY = """
query AccumulationScan($network: EthereumNetwork!, $since: ISO8601DateTime!, $limit: Int!) {
  ethereum(network: $network) {
    dexTrades(
      options: {limit: $limit, desc: "block.timestamp.time"}
      date: {since: $since}
    ) {
      smartContract {
        address {
          address
        }
      }
      baseCurrency {
        symbol
        address
      }
      trades: count
      tradeAmount(in: USD)
      baseAmount
      buyers: count(uniq: actors1.address)
      sellers: count(uniq: actors2.address)
      block {
        timestamp {
          time
        }
      }
    }
  }
}
"""


class BitQueryClient:
    """Fetches token level stats needed for the prototype."""

    def __init__(self, cfg: DataSourceConfig) -> None:
        self._cfg = cfg
        self._client = httpx.Client(
            timeout=cfg.timeout_seconds,
            headers={
                "X-API-KEY": cfg.api_key or "",
                "Content-Type": "application/json",
            },
        )

    def close(self) -> None:
        self._client.close()

    @retry(
        reraise=True,
        stop=stop_after_attempt(3),
        wait=wait_fixed(2),
    )
    def _post(self, query: str, variables: dict) -> dict:
        response = self._client.post(
            self._cfg.api_url,
            json={"query": query, "variables": variables},
        )
        response.raise_for_status()
        payload = response.json()
        if "errors" in payload:
            raise RuntimeError(json.dumps(payload["errors"]))
        return payload

    def fetch_recent_snapshots(
        self,
        engine_cfg: EngineConfig,
        limit: int,
    ) -> Sequence[TokenSnapshot]:
        """Fetches token snapshots using BitQuery dexTrades as placeholder data."""
        since = datetime.now(tz=timezone.utc) - engine_cfg.lookback
        variables = {
            "network": engine_cfg.chain,
            "since": since.isoformat(),
            "limit": limit,
        }
        try:
            payload = self._post(ACCUMULATION_QUERY, variables)
        except RetryError as exc:
            raise RuntimeError("BitQuery request failed") from exc

        trades = payload.get("data", {}).get("ethereum", {}).get("dexTrades", [])
        snapshots: list[TokenSnapshot] = []
        for trade in trades:
            token_address = trade["baseCurrency"]["address"]
            symbol = trade["baseCurrency"]["symbol"] or "UNKNOWN"
            liquidity = float(trade["tradeAmount"])
            volume = float(trade["tradeAmount"])
            block_time = datetime.fromisoformat(
                trade["block"]["timestamp"]["time"].replace("Z", "+00:00")
            )
            whale_tx = WhaleTransaction(
                tx_hash=f"{token_address}:{int(block_time.timestamp())}",
                wallet="unknown",
                volume_usd=volume,
                token_amount=float(trade.get("baseAmount") or 0),
                timestamp=block_time,
            )
            snapshots.append(
                TokenSnapshot(
                    address=token_address,
                    symbol=symbol,
                    name=symbol,
                    chain=engine_cfg.chain,
                    liquidity_usd=liquidity,
                    holder_count=int(trade["buyers"]),
                    price_usd=0,
                    volume_usd_24h=volume,
                    liquidity_change_pct=0,
                    holder_growth_pct=0,
                    whale_transactions=[whale_tx],
                    contract_safety_score=0.5,
                )
            )
        return snapshots

    @staticmethod
    def from_env(env: dict[str, str]) -> "BitQueryClient":
        cfg = DataSourceConfig(
            api_key=env.get("BITQUERY_API_KEY"),
        )
        return BitQueryClient(cfg)

