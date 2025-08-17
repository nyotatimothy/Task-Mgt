import { useEffect, useRef, useState } from "react";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

interface UseTasksHubProps {
  onUpdated?: () => void;
}

export function useTasksHub({ onUpdated }: UseTasksHubProps) {
  const [connected, setConnected] = useState(false);
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    const startConnection = async () => {
      try {
        const connection = new HubConnectionBuilder()
          .withUrl("http://localhost:5175/hubs/tasks")
          .withAutomaticReconnect()
          .configureLogging(LogLevel.Information)
          .build();

        connection.on("taskUpdated", (taskId: number) => {
          console.log("Task updated via SignalR:", taskId);
          onUpdated?.();
        });

        connection.onclose(() => {
          console.log("SignalR connection closed");
          setConnected(false);
        });

        connection.onreconnected(() => {
          console.log("SignalR reconnected");
          setConnected(true);
        });

        connection.onreconnecting(() => {
          console.log("SignalR reconnecting...");
          setConnected(false);
        });

        await connection.start();
        setConnected(true);
        connectionRef.current = connection;
        console.log("SignalR connected successfully");
      } catch (error) {
        console.log("SignalR connection failed:", error);
        setConnected(false);
        // TODO: implement retry/backoff later
      }
    };

    startConnection();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        setConnected(false);
      }
    };
  }, [onUpdated]);

  return {
    connected,
    connection: connectionRef.current,
  };
}
