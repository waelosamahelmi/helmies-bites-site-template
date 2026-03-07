import { useEffect, useRef, useState } from 'react';
import { useTenant } from '../contexts/tenant-context';

interface UseWebSocketOptions {
  onMessage?: (data: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const ws = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { tenant } = useTenant();

  const connect = () => {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = import.meta.env.VITE_WS_URL ||
        (import.meta.env.DEV
          ? `${protocol}//localhost:3000/ws`
          : `${protocol}//${window.location.host}/ws`);

      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        setIsConnected(true);
        options.onConnect?.();
        if (tenant) {
          ws.current?.send(JSON.stringify({ type: 'subscribe', tenantId: tenant.id }));
        }
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
          options.onMessage?.(data);
        } catch {}
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        options.onDisconnect?.();
        reconnectRef.current = setTimeout(connect, 5000);
      };

      ws.current.onerror = () => {};
    } catch {
      reconnectRef.current = setTimeout(connect, 5000);
    }
  };

  const sendMessage = (message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  useEffect(() => {
    connect();
    return () => {
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      ws.current?.close();
    };
  }, [tenant?.id]);

  return { isConnected, lastMessage, sendMessage };
}
