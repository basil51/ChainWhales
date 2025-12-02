"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Alert, Token } from "./types";
import { API_BASE_URL } from "./config";

interface UseAlertsSocketReturn {
  alerts: Alert[];
  tokens: Token[];
  isConnected: boolean;
}

export function useAlertsSocket(
  initialAlerts: Alert[],
  initialTokens: Token[]
): UseAlertsSocketReturn {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [tokens, setTokens] = useState<Token[]>(initialTokens);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Extract base URL without /api or trailing slashes
    const wsUrl = API_BASE_URL.replace(/\/api$/, "").replace(/\/$/, "");
    const socket: Socket = io(`${wsUrl}/alerts`, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to alerts WebSocket");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from alerts WebSocket");
    });

    socket.on("connected", (data) => {
      console.log("WebSocket connected:", data);
    });

    socket.on("new-alert", (newAlert: Alert & { token?: Token }) => {
      console.log("New alert received:", newAlert);
      setAlerts((prev) => [newAlert, ...prev]);
      
      // If token is included, update tokens list
      if (newAlert.token) {
        setTokens((prev) => {
          const existing = prev.find((t) => t.id === newAlert.token!.id);
          if (existing) {
            return prev.map((t) =>
              t.id === newAlert.token!.id ? newAlert.token! : t
            );
          }
          return [newAlert.token!, ...prev];
        });
      }
    });

    socket.on("new-token", (newToken: Token) => {
      console.log("New token received:", newToken);
      setTokens((prev) => {
        const existing = prev.find((t) => t.id === newToken.id);
        if (existing) {
          return prev.map((t) => (t.id === newToken.id ? newToken : t));
        }
        return [newToken, ...prev];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { alerts, tokens, isConnected };
}

