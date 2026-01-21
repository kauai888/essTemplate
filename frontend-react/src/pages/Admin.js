import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { adminService } from '../services';

const Admin = () => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Check if user has admin/approver access
    if (role !== 'admin' && role !== 'approver') {
      navigate('/');
      return;
    }
    loadData();
  }, [activeTab, role, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      if (activeTab === 'users') {
        const data = await adminService.getAllUsers();
        setUsers(data.users || []);
      } else if (activeTab === 'announcements') {
        const data = await adminService.getAnnouncements();
        setAnnouncements(data.announcements || []);
      } else if (activeTab === 'leave') {
        const data = await adminService.getLeaveRequests();
        setLeaveRequests(data.leaveRequests || []);
      }
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveLeave = async (leaveRequestId) => {
    try {
      await adminService.approveLeaveRequest(leaveRequestId, { approvalDate: new Date() });
      setSuccess('Leave request approved successfully');
      loadData();
    } catch (err) {
      setError('Failed to approve leave request');
      console.error('Error:', err);
    }
  };

  const handleRejectLeave = async (leaveRequestId) => {
    try {
      await adminService.rejectLeaveRequest(leaveRequestId, { rejectionReason: 'Rejected by admin' });
      setSuccess('Leave request rejected successfully');
      loadData();
    } catch (err) {
      setError('Failed to reject leave request');
      console.error('Error:', err);
    }
  };

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="admin-wrapper">
      {/* Navigation */}
      <nav className="navigation-wrapper">
        <div className="navigation-container">
          <a href="/" className="navigation-logo-link" aria-label="ESS Admin">
            <div className="navigation-logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2L2 7l10 5l10-5zM2 17l10 5l10-5M2 12l10 5l10-5"/>
              </svg>
            </div>
            <span className="section-title navigation-brand-name">ESS Admin</span>
          </a>
          <div className="navigation-actions">
            <button onClick={handleSignOut} className="btn btn-primary btn-sm" style={{ margin: '0 var(--spacing-md)' }}>
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="admin-main">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user?.first_name} ({role})</p>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={`tab-button ${activeTab === 'announcements' ? 'active' : ''}`}
            onClick={() => setActiveTab('announcements')}
          >
            Announcements
          </button>
          <button
            className={`tab-button ${activeTab === 'leave' ? 'active' : ''}`}
            onClick={() => setActiveTab('leave')}
          >
            Leave Requests
          </button>
          <button
            className={`tab-button ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance
          </button>
        </div>

        {/* Content */}
        <div className="admin-content">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <>
              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="users-section">
                  <h2>Manage Users</h2>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Department</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.employee_id}</td>
                          <td>{user.first_name} {user.last_name}</td>
                          <td>{user.email}</td>
                          <td>{user.role}</td>
                          <td>{user.department}</td>
                          <td>
                            <span className={`status-badge status-${user.status}`}>
                              {user.status}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-link btn-sm">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Announcements Tab */}
              {activeTab === 'announcements' && (
                <div className="announcements-section">
                  <h2>Manage Announcements</h2>
                  <button className="btn btn-primary" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    Create Announcement
                  </button>
                  <div className="announcements-grid">
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className="announcement-card">
                        <h3>{announcement.title}</h3>
                        <p>{announcement.content}</p>
                        <small>{new Date(announcement.created_at).toLocaleDateString()}</small>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Leave Requests Tab */}
              {activeTab === 'leave' && (
                <div className="leave-section">
                  <h2>Leave Requests</h2>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Leave Type</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Days</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveRequests.map((request) => (
                        <tr key={request.id}>
                          <td>{request.employee?.first_name} {request.employee?.last_name}</td>
                          <td>{request.leave_type}</td>
                          <td>{new Date(request.start_date).toLocaleDateString()}</td>
                          <td>{new Date(request.end_date).toLocaleDateString()}</td>
                          <td>{request.number_of_days}</td>
                          <td>
                            <span className={`status-badge status-${request.status}`}>
                              {request.status}
                            </span>
                          </td>
                          <td>
                            {request.status === 'pending' && (
                              <>
                                <button
                                  className="btn btn-link btn-sm"
                                  onClick={() => handleApproveLeave(request.id)}
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn btn-link btn-sm"
                                  onClick={() => handleRejectLeave(request.id)}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <style>{`
        .admin-wrapper {
          min-height: 100vh;
          background: var(--color-surface);
        }

        .admin-main {
          padding: var(--spacing-2xl);
          max-width: var(--content-max-width);
          margin: 0 auto;
        }

        .admin-header {
          margin-bottom: var(--spacing-2xl);
        }

        .admin-header h1 {
          font-size: var(--font-size-2xl);
          margin-bottom: var(--spacing-sm);
        }

        .admin-header p {
          color: var(--color-on-surface-secondary);
        }

        .admin-tabs {
          display: flex;
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-2xl);
          border-bottom: 1px solid var(--color-border);
        }

        .tab-button {
          padding: var(--spacing-md) var(--spacing-lg);
          border: none;
          background: transparent;
          cursor: pointer;
          color: var(--color-on-surface-secondary);
          font-weight: var(--font-weight-medium);
          border-bottom: 2px solid transparent;
          transition: all 0.18s ease;
        }

        .tab-button.active {
          color: var(--color-primary);
          border-bottom-color: var(--color-primary);
        }

        .tab-button:hover {
          color: var(--color-on-surface);
        }

        .admin-content {
          background: white;
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-lg);
        }

        .loading {
          text-align: center;
          padding: var(--spacing-3xl);
          color: var(--color-on-surface-secondary);
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: var(--font-size-sm);
        }

        .data-table th {
          background: var(--color-surface-elevated);
          padding: var(--spacing-md);
          text-align: left;
          font-weight: var(--font-weight-medium);
          border-bottom: 1px solid var(--color-border);
        }

        .data-table td {
          padding: var(--spacing-md);
          border-bottom: 1px solid var(--color-border);
        }

        .data-table tr:hover {
          background: var(--color-surface-elevated);
        }

        .status-badge {
          display: inline-block;
          padding: var(--spacing-xs) var(--spacing-md);
          border-radius: var(--border-radius-full);
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-medium);
        }

        .status-active {
          background: #dcfce7;
          color: #166534;
        }

        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-inactive {
          background: #f3f4f6;
          color: #374151;
        }

        .announcement-card {
          background: white;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-card);
          padding: var(--spacing-lg);
          margin-bottom: var(--spacing-lg);
        }

        .announcement-card h3 {
          margin-bottom: var(--spacing-sm);
        }

        .announcement-card p {
          color: var(--color-on-surface-secondary);
          margin-bottom: var(--spacing-md);
        }

        .announcement-card small {
          color: var(--color-on-surface-secondary);
          font-size: var(--font-size-xs);
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

        @media (max-width: 768px) {
          .data-table {
            font-size: var(--font-size-xs);
          }

          .data-table th,
          .data-table td {
            padding: var(--spacing-sm);
          }

          .admin-tabs {
            flex-wrap: wrap;
            gap: var(--spacing-md);
          }
        }
      `}</style>
    </div>
  );
};

export default Admin;
