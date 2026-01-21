import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useGeolocation } from '../hooks/useAuth';
import { attendanceService, geolocationService } from '../services';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, role } = useAuth();
  const { getLocation } = useGeolocation();
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDate, setCurrentDate] = useState('');
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString(undefined, options));
    fetchTodayAttendance();
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const data = await attendanceService.getTodayAttendance();
      setTodayAttendance(data);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    }
  };

  const handleClockIn = async () => {
    try {
      setLocationLoading(true);
      setError('');
      setSuccess('');

      const location = await getLocation();
      const address = await geolocationService.getAddressFromCoordinates(
        location.latitude,
        location.longitude
      );

      await attendanceService.clockIn(
        location.latitude,
        location.longitude,
        address,
        location.accuracy
      );

      setSuccess('Clocked in successfully!');
      fetchTodayAttendance();
    } catch (err) {
      setError(err.message || 'Failed to clock in. Please try again.');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setLocationLoading(true);
      setError('');
      setSuccess('');

      const location = await getLocation();
      const address = await geolocationService.getAddressFromCoordinates(
        location.latitude,
        location.longitude
      );

      await attendanceService.clockOut(
        location.latitude,
        location.longitude,
        address,
        location.accuracy
      );

      setSuccess('Clocked out successfully!');
      fetchTodayAttendance();
    } catch (err) {
      setError(err.message || 'Failed to clock out. Please try again.');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  const handleAdminPanel = () => {
    if (role === 'admin' || role === 'approver') {
      navigate('/admin');
    } else {
      setError('You do not have permission to access the admin panel');
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* Navigation */}
      <nav className="navigation-wrapper" id="main-navigation">
        <div className="navigation-container">
          <a href="/" className="navigation-logo-link" aria-label="ESS Homepage">
            <div className="navigation-logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2L2 7l10 5l10-5zM2 17l10 5l10-5M2 12l10 5l10-5"/>
              </svg>
            </div>
            <span className="section-title navigation-brand-name">ESS</span>
          </a>
          <div className="navigation-actions">
            {(role === 'admin' || role === 'approver') && (
              <button onClick={handleAdminPanel} className="btn btn-secondary btn-sm" style={{ margin: '0 var(--spacing-md)' }}>
                Admin Panel
              </button>
            )}
            <button onClick={handleSignOut} className="btn btn-primary btn-sm" style={{ margin: '0 var(--spacing-md)' }}>
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Hero Section */}
        <section className="hero-snapshot">
          <div className="hero-snapshot-inner">
            <div className="hero-snapshot-grid">
              {/* Welcome Card */}
              <div className="hero-card hero-welcome">
                <h1 className="hero-title">Welcome back, {user?.first_name || 'Employee'}</h1>
                <p className="hero-date">{currentDate}</p>
                <p className="hero-time">{currentTime.toLocaleTimeString('en-US', { hour12: true })}</p>
              </div>

              {/* Clock In/Out Card */}
              <div className="hero-card hero-action-card">
                <button
                  onClick={todayAttendance?.time_in ? handleClockOut : handleClockIn}
                  className="btn btn-primary btn-lg action-trigger"
                  disabled={locationLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M8 12h8m-4-4v8"/>
                    </g>
                  </svg>
                  {locationLoading ? 'Processing...' : todayAttendance?.time_in ? 'Clock Out' : 'Clock In'}
                </button>
              </div>

              {/* Attendance Status */}
              {todayAttendance && (
                <>
                  <div className="hero-card hero-info-card">
                    <div className="card-icon-wrapper">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                          <path d="M12 6v6l4 2"/>
                          <circle cx="12" cy="12" r="10"/>
                        </g>
                      </svg>
                    </div>
                    <div className="card-content">
                      <span className="card-label">Time In</span>
                      <span className="card-value">{todayAttendance.time_in ? new Date(todayAttendance.time_in).toLocaleTimeString() : 'Not clocked in'}</span>
                    </div>
                  </div>

                  <div className="hero-card hero-info-card">
                    <div className="card-icon-wrapper">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                          <path d="M12 6v6l4 2"/>
                          <circle cx="12" cy="12" r="10"/>
                        </g>
                      </svg>
                    </div>
                    <div className="card-content">
                      <span className="card-label">Time Out</span>
                      <span className="card-value">{todayAttendance.time_out ? new Date(todayAttendance.time_out).toLocaleTimeString() : 'Not clocked out'}</span>
                    </div>
                  </div>

                  <div className="hero-card hero-info-card">
                    <div className="card-icon-wrapper">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                          <path d="M19 21H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2-3h2l2 3h4a2 2 0 0 1 2 2z"/>
                          <circle cx="12" cy="13" r="3"/>
                        </g>
                      </svg>
                    </div>
                    <div className="card-content">
                      <span className="card-label">Hours Worked</span>
                      <span className="card-value">{todayAttendance.hours_worked ? `${todayAttendance.hours_worked.toFixed(2)} hrs` : '0 hrs'}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <style>{`
        .dashboard-wrapper {
          min-height: 100vh;
          background: var(--color-surface);
        }

        .dashboard-main {
          padding: var(--spacing-2xl);
          max-width: var(--content-max-width);
          margin: 0 auto;
        }

        .navigation-wrapper {
          background: white;
          border-bottom: 1px solid var(--color-border);
          padding: var(--spacing-sm) 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .navigation-container {
          max-width: var(--content-max-width);
          margin: 0 auto;
          padding: 0 var(--spacing-lg);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navigation-logo-link {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: var(--color-on-surface);
        }

        .navigation-logo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .navigation-brand-name {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-heading);
        }

        .navigation-actions {
          display: flex;
          gap: var(--spacing-lg);
          align-items: center;
        }

        .alert {
          padding: var(--spacing-md);
          border-radius: var(--border-radius-md);
          margin-bottom: var(--spacing-lg);
          font-size: var(--font-size-sm);
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

        .hero-snapshot-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--spacing-lg);
        }

        .hero-card {
          background: white;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-card);
          padding: var(--spacing-lg);
        }

        .hero-welcome {
          grid-column: span 2;
        }

        .hero-title {
          font-size: var(--font-size-xl);
          margin-bottom: var(--spacing-sm);
        }

        .hero-date,
        .hero-time {
          color: var(--color-on-surface-secondary);
          font-size: var(--font-size-sm);
        }

        .hero-action-card {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-trigger {
          width: 100%;
          justify-content: center;
        }

        .hero-info-card {
          display: flex;
          gap: var(--spacing-lg);
          align-items: center;
        }

        .card-icon-wrapper {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          background: var(--color-surface-elevated);
          border-radius: var(--border-radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary);
        }

        .card-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .card-label {
          font-size: var(--font-size-sm);
          color: var(--color-on-surface-secondary);
        }

        .card-value {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-medium);
          color: var(--color-on-surface);
        }

        @media (max-width: 768px) {
          .hero-welcome {
            grid-column: span 1;
          }

          .navigation-container {
            flex-direction: column;
            gap: var(--spacing-md);
          }

          .hero-snapshot-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
