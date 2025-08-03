// /pages/index.tsx
import { useEffect, useState } from 'react';
import type { StatsData } from '../types';

export default function Home() {
  const [requests, setRequests] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // Создаем EventSource подключение
    const eventSource = new EventSource('/api/stats-stream');

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data: StatsData = JSON.parse(event.data);
        setRequests(data.requests);
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      setIsConnected(false);
    };

    // Очистка при размонтировании
    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, []);

  const simulateRequest = async () => {
    try {
      await fetch('/api/request-logger');
    } catch (error) {
      console.error('Error simulating request:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Live Request Statistics</h1>
      
      <div style={{ 
        padding: '10px', 
        backgroundColor: isConnected ? '#d4edda' : '#f8d7da',
        color: isConnected ? '#155724' : '#721c24',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>

      <div style={{ 
        fontSize: '2rem', 
        padding: '20px', 
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        Requests: <strong>{requests}</strong>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={simulateRequest}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Simulate Request
        </button>
      </div>

      <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#6c757d' }}>
        <p>💡 Click the button to simulate requests and watch the counter update in real-time</p>
        <p>📊 This uses Server-Sent Events (SSE) for live updates</p>
      </div>
    </div>
  );
}
