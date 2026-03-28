import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Dashboard Route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
