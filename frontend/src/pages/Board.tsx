import React from 'react';
import { useAuth } from '../auth/AuthContext';

export function Board() {
  const { username, role, logout } = useAuth();

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Task Board</h1>
        <div>
          <span style={{ marginRight: '15px' }}>
            Welcome, {username} ({role})
          </span>
          <button 
            onClick={logout}
            style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none' }}
          >
            Logout
          </button>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', height: '500px' }}>
        <div style={{ border: '1px solid #ddd', padding: '15px', backgroundColor: '#f8f9fa' }}>
          <h3>Todo</h3>
          <p>Task management coming soon...</p>
        </div>
        
        <div style={{ border: '1px solid #ddd', padding: '15px', backgroundColor: '#fff3cd' }}>
          <h3>In Progress</h3>
          <p>Task management coming soon...</p>
        </div>
        
        <div style={{ border: '1px solid #ddd', padding: '15px', backgroundColor: '#d4edda' }}>
          <h3>Done</h3>
          <p>Task management coming soon...</p>
        </div>
      </div>
    </div>
  );
}
