import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LogoutButton: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return isAuthenticated ? (
    <button onClick={handleLogout} className="logout-btn">Logout</button>
  ) : null;
};

export default LogoutButton;
