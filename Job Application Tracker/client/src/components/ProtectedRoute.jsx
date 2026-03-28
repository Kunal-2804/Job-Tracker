import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  
  if (!user || (!user.token)) {
    // If there's malformed user data without a token, clear it to prevent loops
    if (user && !user.token) {
      sessionStorage.removeItem('user');
    }
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
