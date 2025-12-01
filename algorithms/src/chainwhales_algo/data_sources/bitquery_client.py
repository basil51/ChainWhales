"""Lightweight BitQuery GraphQL wrapper."""

from __future__ import annotations

import json
from datetime import datetime, timedelta, timezone
from typing import Iterable, Sequence

import httpx
from tenacity import RetryError, retry, stop_after_attempt, wait_fixed

from ..config import DataSourceConfig, EngineConfig
from ..models import TokenSnapshot, WhaleTransaction


ACCUMULATION_QUERY_EVM = """
query AccumulationScan($network: EthereumNetwork!, $since: ISO8601DateTime!, $limit: Int!) {
  ethereum(network: $network) {
    dexTrades(
      options: {limit: $limit}
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
      # BitQuery v2 no longer accepts identifiers with dots in the count aggregator
      # (e.g. actors1.address). For now we use total trade count as a proxy for
      # unique buyer/seller activity to avoid GraphQL parse errors.
      buyers: count
      sellers: count
      block {
        timestamp {
          time
        }
      }
    }
  }
}
"""


ACCUMULATION_QUERY_SOLANA = """
query AccumulationScanSolana($limit: Int!, $since: DateTime!) {
  Solana {
    DEXTrades(
      limit: {count: $limit}
      orderBy: {descending: Block_Time}
      where: {
        Transaction: {Result: {Success: true}}
        Block: {Time: {after: $since}}
      }
    ) {
      Trade {
        Buy {
          Account {
            Owner
          }
          Amount
          AmountInUSD
          Currency {
            Symbol
            Name
            MintAddress
          }
        }
      }
      Block {
        Time
      }
    }
  }
}
"""


class BitQueryClient:
    """Fetches token level stats needed for the prototype."""

    def __init__(self, cfg: DataSourceConfig) -> None:
        self._cfg = cfg
        # BitQuery API v2 uses OAuth tokens with Bearer authentication
        # API v1 used X-API-KEY header (no longer works)
        api_key = (cfg.api_key or "").strip()
        headers = {
            "Content-Type": "application/json",
        }
        if api_key:
            headers["Authorization"] = f"Bearer {api_key}"
        self._client = httpx.Client(
            timeout=cfg.timeout_seconds,
            headers=headers,
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
        # BitQuery can hit memory limits or time out on very wide Solana scans.
        # To keep queries cheap and reliable, clamp Solana lookback/limit.
        if engine_cfg.chain.lower() == "solana":
            effective_lookback = min(engine_cfg.lookback, timedelta(minutes=2))
            effective_limit = min(limit, 500)
        else:
            effective_lookback = engine_cfg.lookback
            effective_limit = limit

        since = datetime.now(tz=timezone.utc) - effective_lookback
        variables = {
            "since": since.isoformat(),
            "limit": effective_limit,
        }

        try:
            if engine_cfg.chain.lower() == "solana":
                payload = self._post(ACCUMULATION_QUERY_SOLANA, variables)
                trades = (
                    payload.get("data", {})
                    .get("Solana", {})
                    .get("DEXTrades", [])
                )
            else:
                # Default to EVM-style query; engine_cfg.chain should be a valid
                # EthereumNetwork value (e.g. "ethereum", "bsc", "matic", ...).
                variables["network"] = engine_cfg.chain
                payload = self._post(ACCUMULATION_QUERY_EVM, variables)
                trades = (
                    payload.get("data", {})
                    .get("ethereum", {})
                    .get("dexTrades", [])
                )
        except RetryError as exc:
            raise RuntimeError("BitQuery request failed") from exc

        snapshots: list[TokenSnapshot] = []
        if engine_cfg.chain.lower() == "solana":
            # Aggregate trades by token to form snapshots
            token_stats = {}

            for row in trades:
                trade = row.get("Trade") or {}
                buy = trade.get("Buy") or {}
                currency = buy.get("Currency") or {}

                token_address = currency.get("MintAddress") or "unknown"
                symbol = currency.get("Symbol") or "UNKNOWN"
                name = currency.get("Name") or symbol

                amount_usd = float(buy.get("AmountInUSD") or 0)
                amount = float(buy.get("Amount") or 0)

                ts = (row.get("Block") or {}).get("Time") or ""
                if ts.endswith("Z"):
                    ts = ts.replace("Z", "+00:00")
                block_time = (
                    datetime.fromisoformat(ts)
                    if ts
                    else datetime.now(tz=timezone.utc)
                )

                whale_tx = WhaleTransaction(
                    tx_hash=f"{token_address}:{int(block_time.timestamp())}",
                    wallet=(buy.get("Account") or {}).get("Owner") or "unknown",
                    volume_usd=amount_usd,
                    token_amount=amount,
                    timestamp=block_time,
                )

                if token_address not in token_stats:
                    token_stats[token_address] = {
                        "symbol": symbol,
                        "name": name,
                        "volume_usd": 0.0,
                        "holders": set(),
                        "txs": [],
                    }
                
                stats = token_stats[token_address]
                stats["volume_usd"] += amount_usd
                stats["txs"].append(whale_tx)
                if whale_tx.wallet != "unknown":
                    stats["holders"].add(whale_tx.wallet)

            for addr, stats in token_stats.items():
                total_volume = stats["volume_usd"]
                holder_count = len(stats["holders"]) or 1  # At least 1 if no owner info

                snapshots.append(
                    TokenSnapshot(
                        address=addr,
                        symbol=stats["symbol"],
                        name=stats["name"],
                        chain=engine_cfg.chain,
                        # Use total volume as proxy for liquidity in this prototype
                        liquidity_usd=total_volume,
                        holder_count=holder_count,
                        price_usd=0.0,
                        volume_usd_24h=total_volume,
                        liquidity_change_pct=0.0,
                        holder_growth_pct=0.0,
                        whale_transactions=stats["txs"],
                        contract_safety_score=0.5,
                    )
                )
        else:
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
        timeout = float(env.get("BITQUERY_TIMEOUT_SECONDS", "60"))
        cfg = DataSourceConfig(
            api_url=env.get("BITQUERY_API_URL", DataSourceConfig.api_url),
            api_key=env.get("BITQUERY_API_KEY"),
            timeout_seconds=timeout,
        )
        return BitQueryClient(cfg)

