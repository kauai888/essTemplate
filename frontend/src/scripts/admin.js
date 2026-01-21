function checkAdminAccess() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  if (!token) {
    redirectToLogin('Not authenticated. Please log in first.');
    return false;
  }
  
  if (role !== 'admin') {
    redirectToLogin('Access Denied. Admin access required.');
    return false;
  }
  
  return true;
}

function redirectToLogin(message) {
  localStorage.clear();
  sessionStorage.clear();
  
  if (message) {
    sessionStorage.setItem('loginError', message);
  }
  
  window.location.href = 'login.html';
}

window.addEventListener('load', function() {
  const authCheckDiv = document.getElementById('authCheck');
  
  if (authCheckDiv) {
    authCheckDiv.style.display = 'flex';
  }
  
  if (!checkAdminAccess()) {
    return;
  }

  if (authCheckDiv) {
    authCheckDiv.style.display = 'none';
  }
  
  console.log('✅ Admin access verified');
  initializeAdminPanel();
});

function initializeAdminPanel() {
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');
      
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));

      this.classList.add('active');
      document.getElementById(tabName + '-tab').classList.add('active');
    });
  });

  console.log('Admin panel loaded');
  loadEmployees();
  loadAttendance();
  loadLeaveBalances();
  loadAnnouncements();
}

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
  
  document.getElementById('employeeId').value = employeeId;
  
  document.getElementById('employeeModal').style.display = 'flex';
}

function closeEmployeeModal() {
  document.getElementById('employeeModal').style.display = 'none';
  document.getElementById('employeeForm').reset();
}

const employeeForm = document.getElementById('employeeForm');
if (employeeForm) {
  employeeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const employeeId = document.getElementById('employeeId').value;
    const password = document.getElementById('employeePassword').value;
    const confirmPassword = document.getElementById('employeeConfirmPassword').value;

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

    closeEmployeeModal();

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
  console.log('Loading employees...');
}

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

let editingAttendanceKey = null;

function openEditAttendanceModal(employeeId, date) {
  editingAttendanceKey = `${employeeId}-${date}`;

  document.getElementById('attendanceDate').value = date;
  
  document.getElementById('attendanceModal').style.display = 'flex';
}

function closeAttendanceModal() {
  document.getElementById('attendanceModal').style.display = 'none';
  document.getElementById('attendanceForm').reset();
}

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

    closeAttendanceModal();
    loadAttendance();
  });
}

function loadAttendance() {
  console.log('Loading attendance...');
}

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

let editingLeaveEmployeeId = null;

function openEditLeaveModal(employeeId) {
  editingLeaveEmployeeId = employeeId;
  
  document.getElementById('leaveModal').style.display = 'flex';
}

function closeLeaveModal() {
  document.getElementById('leaveModal').style.display = 'none';
  document.getElementById('leaveForm').reset();
}

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
    
    closeLeaveModal();
    loadLeaveBalances();
  });
}

function loadLeaveBalances() {
  console.log('Loading leave balances...');
}

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

  document.getElementById('announcementModal').style.display = 'flex';
}

function closeAnnouncementModal() {
  document.getElementById('announcementModal').style.display = 'none';
  document.getElementById('announcementForm').reset();
}

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
  console.log('Loading announcements...');
}

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

  document.getElementById('sign-out-btn').addEventListener('click', function(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to sign out?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      sessionStorage.clear();
      window.location.href = 'login.html';
    }
  });

  console.log('Admin panel loaded');
  loadEmployees();
  loadAttendance();
  loadLeaveBalances();
  loadAnnouncements();
}