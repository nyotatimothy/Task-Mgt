import { useEffect, useRef } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

interface UseSignalRProps {
  onTaskUpdated?: () => void;
}

export function useSignalR({ onTaskUpdated }: UseSignalRProps) {
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    // TODO: implement SignalR hub on backend first
    // For now, just setup the connection structure without actually connecting
    
    const startConnection = async () => {
      try {
        const connection = new HubConnectionBuilder()
          .withUrl('http://localhost:5175/hubs/tasks')
          .withAutomaticReconnect()
          .configureLogging(LogLevel.Information)
          .build();

        connection.on('TaskUpdated', () => {
          console.log('Task updated event received');
          onTaskUpdated?.();
        });

        await connection.start();
        connectionRef.current = connection;
        console.log('SignalR connected');
      } catch (error) {
        console.log('SignalR connection failed (expected - hub not implemented yet):', error);
        // TODO: implement retry/backoff later
      }
    };

    startConnection();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
    };
  }, [onTaskUpdated]);

  return {
    connection: connectionRef.current,
    isConnected: connectionRef.current?.state === 'Connected'
  };
}
