import "server-only";

import { API_BASE_URL } from "./config";
import { Alert, Token } from "./types";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.statusText}`);
  }
  return (await res.json()) as T;
}

export function getTokens(): Promise<Token[]> {
  return fetchJson<Token[]>("/tokens");
}

export function getAlerts(): Promise<Alert[]> {
  return fetchJson<Alert[]>("/alerts");
}

export function getToken(id: string): Promise<Token> {
  return fetchJson<Token>(`/tokens/${id}`);
}

