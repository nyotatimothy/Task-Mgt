import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { RequireAuth } from './auth/RequireAuth';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Board } from './pages/Board';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/app" 
            element={
              <RequireAuth>
                <Board />
              </RequireAuth>
            } 
          />
          <Route path="/" element={<Navigate to="/app" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
