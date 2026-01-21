/**
 * Admin Panel JavaScript
 * Authentication and Authorization checks
 */

// ============================================
// AUTHENTICATION & AUTHORIZATION
// ============================================

/**
 * Check if user is authenticated and has admin role
 */
function checkAdminAccess() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  // Check if user is logged in
  if (!token) {
    redirectToLogin('Not authenticated. Please log in first.');
    return false;
  }
  
  // Check if user has admin role
  if (role !== 'admin') {
    redirectToLogin('Access Denied. Admin access required.');
    return false;
  }
  
  return true;
}

/**
 * Redirect to login page with error message
 */
function redirectToLogin(message) {
  localStorage.clear(); // Clear any invalid data
  sessionStorage.clear();
  
  if (message) {
    sessionStorage.setItem('loginError', message);
  }
  
  // Redirect to login page
  window.location.href = 'login.html';
}

// ============================================
// INITIALIZATION - Check auth before any setup
// ============================================

// Verify admin access immediately on page load
window.addEventListener('load', function() {
  const authCheckDiv = document.getElementById('authCheck');
  
  // Show checking message
  if (authCheckDiv) {
    authCheckDiv.style.display = 'flex';
  }
  
  // Verify admin access
  if (!checkAdminAccess()) {
    return; // Stop execution if not admin
  }
  
  // Hide checking message and proceed
  if (authCheckDiv) {
    authCheckDiv.style.display = 'none';
  }
  
  console.log('✅ Admin access verified');
  initializeAdminPanel();
});

/**
 * Initialize admin panel after authentication
 */
function initializeAdminPanel() {
  // Setup tab switching
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');
      
      // Remove active class from all tabs and contents
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      this.classList.add('active');
      document.getElementById(tabName + '-tab').classList.add('active');
    });
  });

  // Load initial data
  console.log('Admin panel loaded');
  loadEmployees();
  loadAttendance();
  loadLeaveBalances();
  loadAnnouncements();
}

// ============================================
// EMPLOYEE MANAGEMENT
// ============================================
let editingEmployeeId = null;

function openCreateEmployeeModal() {
  editingEmployeeId = null;
  document.getElementById('employeeModalTitle').textContent = 'Create Employee';
  document.getElementById('employeeForm').reset();
  document.getElementById('employeeId').disabled = false;
  document.getElementById('employeeModal').style.display = 'flex';
}

function openEditEmployeeModal(employeeId) {
  editingEmployeeId = employeeId;
  document.getElementById('employeeModalTitle').textContent = 'Edit Employee';
  document.getElementById('employeeId').disabled = true;
  
  // Populate form with existing data (mock data)
  document.getElementById('employeeId').value = employeeId;
  document.getElementById('employeeName').value = 'Alex Witiwitwiw'; // Replace with actual data
  document.getElementById('employeeEmail').value = 'john@company.com';
  document.getElementById('employeePosition').value = 'Software Engineer';
  document.getElementById('employeeStatus').value = 'Active';
  
  document.getElementById('employeeModal').style.display = 'flex';
}

function closeEmployeeModal() {
  document.getElementById('employeeModal').style.display = 'none';
  document.getElementById('employeeForm').reset();
}

// Employee form submission
const employeeForm = document.getElementById('employeeForm');
if (employeeForm) {
  employeeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const employeeId = document.getElementById('employeeId').value;
    const password = document.getElementById('employeePassword').value;
    const confirmPassword = document.getElementById('employeeConfirmPassword').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const employeeData = {
      employeeId: employeeId,
      name: document.getElementById('employeeName').value,
      email: document.getElementById('employeeEmail').value,
      position: document.getElementById('employeePosition').value,
      password: password,
      status: document.getElementById('employeeStatus').value
    };

    console.log(editingEmployeeId ? 'Updating employee:' : 'Creating employee:', employeeData);
    alert(`Employee ${editingEmployeeId ? 'updated' : 'created'} successfully!`);
    
    // In production, send to backend
    closeEmployeeModal();
    
    // Refresh table (mock)
    loadEmployees();
  });
}

function deleteEmployee(employeeId) {
  if (confirm(`Are you sure you want to delete employee ${employeeId}?`)) {
    console.log('Deleting employee:', employeeId);
    alert('Employee deleted successfully!');
    loadEmployees();
  }
}

function loadEmployees() {
  // Mock function - in production, fetch from backend
  console.log('Loading employees...');
}

// Search employees
const employeeSearchInput = document.getElementById('employeeSearchInput');
if (employeeSearchInput) {
  employeeSearchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#employeesTableBody tr');
    
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
  });
}

// ============================================
// ATTENDANCE MANAGEMENT
// ============================================
let editingAttendanceKey = null;

function openEditAttendanceModal(employeeId, date) {
  editingAttendanceKey = `${employeeId}-${date}`;
  
  // Populate form (mock data)
  document.getElementById('attendanceEmployeeName').value = 'Alex Witiwitwiw';
  document.getElementById('attendanceDate').value = date;
  document.getElementById('attendanceClockIn').value = '08:00';
  document.getElementById('attendanceClockOut').value = '17:30';
  
  document.getElementById('attendanceModal').style.display = 'flex';
}

function closeAttendanceModal() {
  document.getElementById('attendanceModal').style.display = 'none';
  document.getElementById('attendanceForm').reset();
}

// Attendance form submission
const attendanceForm = document.getElementById('attendanceForm');
if (attendanceForm) {
  attendanceForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const attendanceData = {
      key: editingAttendanceKey,
      date: document.getElementById('attendanceDate').value,
      clockIn: document.getElementById('attendanceClockIn').value,
      clockOut: document.getElementById('attendanceClockOut').value
    };

    console.log('Updating attendance:', attendanceData);
    alert('Attendance updated successfully!');
    
    // In production, send to backend
    closeAttendanceModal();
    loadAttendance();
  });
}

function loadAttendance() {
  // Mock function
  console.log('Loading attendance...');
}

// Search attendance
const attendanceSearchInput = document.getElementById('attendanceSearchInput');
if (attendanceSearchInput) {
  attendanceSearchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#attendanceTableBody tr');
    
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
  });
}

// ============================================
// LEAVE BALANCE MANAGEMENT
// ============================================
let editingLeaveEmployeeId = null;

function openEditLeaveModal(employeeId) {
  editingLeaveEmployeeId = employeeId;
  
  // Populate form (mock data)
  document.getElementById('leaveEmployeeName').value = 'Alex Witiwitwiw';
  document.getElementById('leaveAnnual').value = 15;
  document.getElementById('leaveSick').value = 10;
  document.getElementById('leaveEmergency').value = 3;
  
  document.getElementById('leaveModal').style.display = 'flex';
}

function closeLeaveModal() {
  document.getElementById('leaveModal').style.display = 'none';
  document.getElementById('leaveForm').reset();
}

// Leave form submission
const leaveForm = document.getElementById('leaveForm');
if (leaveForm) {
  leaveForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const leaveData = {
      employeeId: editingLeaveEmployeeId,
      annualLeave: parseInt(document.getElementById('leaveAnnual').value),
      sickLeave: parseInt(document.getElementById('leaveSick').value),
      emergencyLeave: parseInt(document.getElementById('leaveEmergency').value)
    };

    console.log('Updating leave balance:', leaveData);
    alert('Leave balance updated successfully!');
    
    // In production, send to backend
    closeLeaveModal();
    loadLeaveBalances();
  });
}

function loadLeaveBalances() {
  // Mock function
  console.log('Loading leave balances...');
}

// Search leave
const leaveSearchInput = document.getElementById('leaveSearchInput');
if (leaveSearchInput) {
  leaveSearchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#leaveTableBody tr');
    
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchTerm) ? '' : 'none';
  });
});

/**
 * Announcement Management
 */
const announcementForm = document.getElementById('announcementForm');
let editingAnnouncementId = null;

function openCreateAnnouncementModal() {
  editingAnnouncementId = null;
  document.getElementById('announcementModalTitle').textContent = 'Create Announcement';
  announcementForm.reset();
  document.getElementById('announcementDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('announcementModal').style.display = 'flex';
}

function openEditAnnouncementModal(announcementId) {
  editingAnnouncementId = announcementId;
  document.getElementById('announcementModalTitle').textContent = 'Edit Announcement';
  
  // Populate form with existing data (mock)
  document.getElementById('announcementTitle').value = 'Sample Announcement';
  document.getElementById('announcementContent').value = 'Sample announcement content here...';
  document.getElementById('announcementDate').value = '2026-10-24';
  document.getElementById('announcementPinned').checked = announcementId === 1;
  
  document.getElementById('announcementModal').style.display = 'flex';
}

function closeAnnouncementModal() {
  document.getElementById('announcementModal').style.display = 'none';
  document.getElementById('announcementForm').reset();
}

// Announcement form submission

if (announcementForm) {
  announcementForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const announcementData = {
      id: editingAnnouncementId,
      title: document.getElementById('announcementTitle').value,
      content: document.getElementById('announcementContent').value,
      date: document.getElementById('announcementDate').value,
      pinned: document.getElementById('announcementPinned').checked
    };

    console.log(editingAnnouncementId ? 'Updating announcement:' : 'Creating announcement:', announcementData);
    alert(`Announcement ${editingAnnouncementId ? 'updated' : 'created'} successfully!`);
    
    // In production, send to backend
    closeAnnouncementModal();
    loadAnnouncements();
  });
}

function deleteAnnouncement(announcementId) {
  if (confirm('Are you sure you want to delete this announcement?')) {
    console.log('Deleting announcement:', announcementId);
    alert('Announcement deleted successfully!');
    loadAnnouncements();
  }
}

function loadAnnouncements() {
  // Mock function
  console.log('Loading announcements...');
}

/**
 * Modal Click Outside Handler
 */
document.getElementById('employeeModal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeEmployeeModal();
  }
});

document.getElementById('attendanceModal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeAttendanceModal();
  }
});

document.getElementById('leaveModal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeLeaveModal();
  }
});

document.getElementById('announcementModal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeAnnouncementModal();
  }
});

  /**
   * Sign Out Handler
   */
  document.getElementById('sign-out-btn').addEventListener('click', function(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to sign out?')) {
      // Clear authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      sessionStorage.clear();
      window.location.href = 'login.html';
    }
  });

  // Load initial data
  console.log('Admin panel loaded');
  loadEmployees();
  loadAttendance();
  loadLeaveBalances();
  loadAnnouncements();
}

// Old DOMContentLoaded removed - now handled in authentication check above
