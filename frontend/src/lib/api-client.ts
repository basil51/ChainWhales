"use client";

import { useAuth } from "@clerk/nextjs";
import { API_BASE_URL } from "./config";

export function useApiClient() {
  const { getToken } = useAuth();

  async function fetchWithAuth<T>(
    path: string,
    options?: RequestInit
  ): Promise<T> {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...options?.headers,
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
    }

    return response.json();
  }

  return { fetchWithAuth };
}

