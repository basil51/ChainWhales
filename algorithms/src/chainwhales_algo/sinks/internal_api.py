"""Sink that forwards tokens and alerts to the NestJS internal API."""

from __future__ import annotations

from typing import Any

import httpx

from ..models import AlertSignal, TokenSnapshot

RiskLevel = str  # backend expects "low" | "medium" | "high"
SignalStrength = str  # backend expects "medium" | "high"


class InternalApiSink:
    def __init__(self, base_url: str = "http://localhost:4000") -> None:
        self._client = httpx.Client(base_url=base_url.rstrip("/"))
        self._token_cache: dict[str, str] = {}

    def close(self) -> None:
        self._client.close()

    def handle_alert(self, alert: AlertSignal) -> None:
        token_id = self._ensure_token(alert.token, alert.score)
        payload = {
            "tokenId": token_id,
            "score": alert.score,
            "signalStrength": self._classify_signal(alert.score),
            "deliveryTargets": ["websocket"],
        }
        response = self._client.post("/internal/alerts", json=payload, timeout=10)
        response.raise_for_status()

    def _ensure_token(self, token: TokenSnapshot, score: float) -> str:
        cached = self._token_cache.get(token.address)
        if cached:
            return cached

        payload = {
            "address": token.address,
            "name": token.name,
            "symbol": token.symbol,
            "chain": token.chain,
            "liquidityUsd": token.liquidity_usd,
            "volumeUsd24h": token.volume_usd_24h,
            "holderCount": token.holder_count,
            "score": score,
            "riskLevel": self._classify_risk(token),
        }

        response = self._client.post("/internal/tokens", json=payload, timeout=10)
        if response.is_success:
            token_id = response.json()["id"]
            self._token_cache[token.address] = token_id
            return token_id

        # duplicate token or other error — attempt lookup before raising
        existing_id = self._lookup_token_id(token.address)
        if existing_id:
            self._token_cache[token.address] = existing_id
            return existing_id

        response.raise_for_status()
        raise RuntimeError("unreachable")

    def _lookup_token_id(self, address: str) -> str | None:
        response = self._client.get("/tokens", timeout=10)
        response.raise_for_status()
        for token in response.json():
            if token.get("address") == address:
                return token.get("id")
        return None

    @staticmethod
    def _classify_risk(token: TokenSnapshot) -> RiskLevel:
        safety = token.contract_safety_score
        if safety >= 0.8:
            return "low"
        if safety >= 0.5:
            return "medium"
        return "high"

    @staticmethod
    def _classify_signal(score: float) -> SignalStrength:
        return "high" if score >= 85 else "medium"

