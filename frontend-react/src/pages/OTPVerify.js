import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const OTPVerify = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { verifyOTP } = useAuth();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
    if (timer > 0) {
      const interval = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(interval);
    }
    setResendDisabled(false);
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      await verifyOTP(userId, otp);
      setSuccess('OTP verified successfully. Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    // TODO: Implement resend OTP functionality
    setTimer(300);
    setResendDisabled(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="otp-wrapper">
      <div className="otp-container">
        <div className="otp-card">
          <div className="otp-header">
            <h1>Verify Your Email</h1>
            <p>Enter the 6-digit OTP sent to your email</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} className="otp-form">
            <div className="form-group">
              <label htmlFor="otp">One-Time Password</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength="6"
                disabled={loading}
                style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }}
              />
            </div>

            <button
              type="submit"
              className={`btn btn-primary btn-lg ${loading ? 'loading' : ''}`}
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <div className="otp-footer">
              <p>OTP expires in: <strong>{formatTime(timer)}</strong></p>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resendDisabled}
                className="btn btn-link"
              >
                Resend OTP
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .otp-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .otp-container {
          width: 100%;
          max-width: 400px;
          padding: var(--spacing-lg);
        }

        .otp-card {
          background: white;
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-2xl);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .otp-header {
          text-align: center;
          margin-bottom: var(--spacing-2xl);
        }

        .otp-header h1 {
          font-size: var(--font-size-2xl);
          margin-bottom: var(--spacing-sm);
          color: var(--color-on-surface);
        }

        .otp-header p {
          color: var(--color-on-surface-secondary);
          font-size: var(--font-size-sm);
        }

        .otp-form {
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

        .otp-footer {
          text-align: center;
          margin-top: var(--spacing-lg);
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--color-border);
          font-size: var(--font-size-sm);
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

export default OTPVerify;
