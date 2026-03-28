import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, Loader2 } from 'lucide-react';
import authService from '../services/authService';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user.token) {
      navigate('/');
    }
  }, [navigate]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.login(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)', padding: '2rem' }}>
      <div className="auth-container">
        {/* Left Side: Illustration */}
        <div className="auth-illustration">
           <img src="/login_illustration.png" alt="Login Illustration" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* Right Side: Form */}
        <div className="auth-form-side">
          <div style={{ display: 'flex', marginBottom: '2rem', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase size={32} className="logo-icon" />
            <h2 className="text-gradient" style={{ margin: 0 }}>JobTracker</h2>
          </div>
          
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Welcome back</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Log in to access your dashboard.</p>
          
          {error && (
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--status-rejected-text)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              {error}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Email or phone number</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={onChange} 
                className="form-input" 
                placeholder="you@example.com" 
                required 
              />
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Password</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={onChange} 
                className="form-input" 
                placeholder="Enter password" 
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.875rem' }} disabled={loading}>
              {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : 'Log in'}
            </button>
          </form>
          
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Link to="/register" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '0.875rem' }}>
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
