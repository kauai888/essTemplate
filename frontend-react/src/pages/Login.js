import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/main.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      setLoading(true);
      const result = await login(username, password);

      if (result.requiresOTP) {
        setSuccess('OTP sent to your email. Redirecting...');
        setTimeout(() => {
          navigate(`/otp-verify/${result.userId}`);
        }, 1500);
      } else {
        setSuccess('Login successful. Redirecting...');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>ESS - Employee Self-Service</h1>
            <p>Sign in to your account</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className={`btn btn-primary btn-lg ${loading ? 'loading' : ''}`}
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          <div className="login-footer">
            <p>© 2026 Employee Self-Service System. All rights reserved.</p>
          </div>
        </div>
      </div>

      <style>{`
        .login-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .login-container {
          width: 100%;
          max-width: 400px;
          padding: var(--spacing-lg);
        }

        .login-card {
          background: white;
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-2xl);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .login-header {
          text-align: center;
          margin-bottom: var(--spacing-2xl);
        }

        .login-header h1 {
          font-size: var(--font-size-2xl);
          margin-bottom: var(--spacing-sm);
          color: var(--color-on-surface);
        }

        .login-header p {
          color: var(--color-on-surface-secondary);
          font-size: var(--font-size-sm);
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .form-group label {
          font-weight: var(--font-weight-medium);
          color: var(--color-on-surface);
        }

        .alert {
          padding: var(--spacing-md);
          border-radius: var(--border-radius-md);
          font-size: var(--font-size-sm);
          margin-bottom: var(--spacing-lg);
        }

        .alert-error {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        .alert-success {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #86efac;
        }

        .login-footer {
          text-align: center;
          margin-top: var(--spacing-2xl);
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--color-border);
          font-size: var(--font-size-xs);
          color: var(--color-on-surface-secondary);
        }

        .btn.loading {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default Login;
