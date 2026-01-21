function initializeNavigation() {
  let lastScrollTop = 0;
  const navWrapper = document.getElementById('main-navigation');

  window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
      navWrapper.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
      navWrapper.style.padding = 'var(--spacing-xs) 0';
    } else {
      navWrapper.style.boxShadow = 'none';
      navWrapper.style.padding = 'var(--spacing-sm) 0';
    }
    
    lastScrollTop = scrollTop;
  }, { passive: true });
}

const EMPLOYEE_ID = 1;

try {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = today.toLocaleDateString(undefined, options);

        document.getElementById("date").textContent = formattedDate;
    } catch (error) {
        console.error("Error displaying date:", error);
        document.getElementById("date").textContent = "Unable to load date.";
    }

setInterval (
()=>(document.getElementById('real-time-clock').innerText = new Date().
toLocaleTimeString("en-US", {hour12:true}))
)

function openHRRequestModal() {
  document.getElementById('hrRequestModal').style.display = 'flex';
}

function closeHRRequestModal() {
  document.getElementById('hrRequestModal').style.display = 'none';
  document.getElementById('hrRequestForm').reset();
  document.getElementById('additionalInfoSection').style.display = 'none';
}

function openFilingModal() {
  document.getElementById('filingModal').style.display = 'flex';
}

function closeFilingModal() {
  document.getElementById('filingModal').style.display = 'none';
  document.getElementById('filingForm').reset();
}

function openExpenseClaimModal() {
  document.getElementById('expenseClaimModal').style.display = 'flex';
}

function closeExpenseClaimModal() {
  document.getElementById('expenseClaimModal').style.display = 'none';
  document.getElementById('expenseClaimForm').reset();
}

let currentFilingMonth = new Date();
let currentExpenseMonth = new Date();

function openFilingCalendar() {
  document.getElementById('filingCalendarModal').style.display = 'flex';
  renderFilingCalendar();
}

function closeFilingCalendar() {
  document.getElementById('filingCalendarModal').style.display = 'none';
}

function openExpenseCalendar() {
  document.getElementById('expenseCalendarModal').style.display = 'flex';
  renderExpenseCalendar();
}

function closeExpenseCalendar() {
  document.getElementById('expenseCalendarModal').style.display = 'none';
}

function previousMonth() {
  currentFilingMonth.setMonth(currentFilingMonth.getMonth() - 1);
  renderFilingCalendar();
}

function nextMonth() {
  currentFilingMonth.setMonth(currentFilingMonth.getMonth() + 1);
  renderFilingCalendar();
}

function previousExpenseMonth() {
  currentExpenseMonth.setMonth(currentExpenseMonth.getMonth() - 1);
  renderExpenseCalendar();
}

function nextExpenseMonth() {
  currentExpenseMonth.setMonth(currentExpenseMonth.getMonth() + 1);
  renderExpenseCalendar();
}

function renderFilingCalendar() {
  const year = currentFilingMonth.getFullYear();
  const month = currentFilingMonth.getMonth();
  
  document.getElementById('calendarMonthYear').textContent = 
    new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendar = document.getElementById('calendar');
  calendar.innerHTML = '';

  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dayHeaders.forEach(day => {
    const header = document.createElement('div');
    header.className = 'calendar-day-header';
    header.textContent = day;
    calendar.appendChild(header);
  });

  for (let i = firstDay - 1; i >= 0; i--) {
    const day = document.createElement('div');
    day.className = 'calendar-day other-month';
    day.textContent = daysInPrevMonth - i;
    calendar.appendChild(day);
  }

  const today = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    const day = document.createElement('div');
    day.className = 'calendar-day';
    day.textContent = i;

    const date = new Date(year, month, i);

    if (i === 5 || i === 15) {
      day.classList.add('deadline');
    }

    if ((month === 11 && i === 25) || (month === 0 && i === 1)) {
      day.classList.add('holiday');
    }

    if (date.toDateString() === today.toDateString()) {
      day.classList.add('today');
    }

    calendar.appendChild(day);
  }

  const remainingDays = 42 - (firstDay + daysInMonth);
  for (let i = 1; i <= remainingDays; i++) {
    const day = document.createElement('div');
    day.className = 'calendar-day other-month';
    day.textContent = i;
    calendar.appendChild(day);
  }
}

function renderExpenseCalendar() {
  const year = currentExpenseMonth.getFullYear();
  const month = currentExpenseMonth.getMonth();
  
  document.getElementById('expenseCalendarMonthYear').textContent = 
    new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendar = document.getElementById('expenseCalendar');
  calendar.innerHTML = '';

  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dayHeaders.forEach(day => {
    const header = document.createElement('div');
    header.className = 'calendar-day-header';
    header.textContent = day;
    calendar.appendChild(header);
  });

  for (let i = firstDay - 1; i >= 0; i--) {
    const day = document.createElement('div');
    day.className = 'calendar-day other-month';
    day.textContent = daysInPrevMonth - i;
    calendar.appendChild(day);
  }

  const today = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    const day = document.createElement('div');
    day.className = 'calendar-day';
    day.textContent = i;

    const date = new Date(year, month, i);

    if (i === 10 || i === 25) {
      day.classList.add('deadline');
    }

    if ((month === 11 && i === 25) || (month === 0 && i === 1)) {
      day.classList.add('holiday');
    }

    if (date.toDateString() === today.toDateString()) {
      day.classList.add('today');
    }

    calendar.appendChild(day);
  }

  const remainingDays = 42 - (firstDay + daysInMonth);
  for (let i = 1; i <= remainingDays; i++) {
    const day = document.createElement('div');
    day.className = 'calendar-day other-month';
    day.textContent = i;
    calendar.appendChild(day);
  }
}

function openPersonalInfoModal() {
  document.getElementById('personalInfoModal').style.display = 'flex';
}

function closePersonalInfoModal() {
  document.getElementById('personalInfoModal').style.display = 'none';
}

function openFiledOvertimeModal() {
  document.getElementById('filedOvertimeModal').style.display = 'flex';
}

function closeFiledOvertimeModal() {
  document.getElementById('filedOvertimeModal').style.display = 'none';
}

function openLeaveLedgerModal() {
  document.getElementById('leaveLedgerModal').style.display = 'flex';
}

function closeLeaveLedgerModal() {
  document.getElementById('leaveLedgerModal').style.display = 'none';
}

function openChangePasswordModal() {
  document.getElementById('changePasswordModal').style.display = 'flex';
}

function closeChangePasswordModal() {
  document.getElementById('changePasswordModal').style.display = 'none';
  document.getElementById('changePasswordForm').reset();
}

function submitPasswordChange(event) {
  event.preventDefault();
  
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (newPassword !== confirmPassword) {
    alert('New passwords do not match!');
    return;
  }

  if (newPassword.length < 8) {
    alert('Password must be at least 8 characters long!');
    return;
  }

  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumbers = /\d/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
    alert('Password must contain uppercase, lowercase, numbers, and special characters!');
    return;
  }

  console.log('Password change submitted:', { currentPassword, newPassword });
  alert('Password updated successfully!');
  closeChangePasswordModal();

      // In production, send to backend:
      // await fetch('/api/auth/change-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ currentPassword, newPassword })
      // });
}

function showLocationNotification(title, address, locationData) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4caf50;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    max-width: 400px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;
  
  notification.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 8px;">${title}</div>
    <div style="font-size: 14px; opacity: 0.95;">
      📍 ${address}<br>
      <small style="opacity: 0.8;">Lat: ${locationData.latitude.toFixed(4)}, Lon: ${locationData.longitude.toFixed(4)}</small>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

function showErrorNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #dc3545;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    max-width: 400px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;
  
  notification.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 4px;">⚠️ Error</div>
    <div style="font-size: 14px;">${message}</div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

async function initializeClockStatus() {
  try {
    const status = await GeolocationService.getStatus(EMPLOYEE_ID);
    if (status.success) {
      updateClockButtonStatus(status.data.data.status);
    }
  } catch (error) {
    console.log('Could not load clock status:', error);
  }
}

function updateClockButtonStatus(status) {
  const clockButtons = document.querySelectorAll('.action-trigger');
  clockButtons.forEach(button => {
    if (button.textContent.includes('Clock')) {
      if (status === 'clocked-in') {
        button.textContent = '⏹ Clock Out';
        button.style.backgroundColor = 'var(--color-secondary)';
      } else if (status === 'clocked-out' || status === 'not-clocked-in') {
        button.textContent = '▶ Clock In';
        button.style.backgroundColor = 'var(--color-primary)';
      }
    }
  });
}

function addAttendanceRecord(date, checkInTime, checkInLocation, checkOutTime, checkOutLocation, checkInTime2, checkOutTime2, hours) {
  const tbody = document.querySelector('.attendance-table tbody');
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>${date}</td>
    <td>${checkInTime}</td>
    <td><span class="location-badge">📍 ${checkInLocation.name}</span></td>
    <td>${checkOutTime || '—'}</td>
    <td>${checkOutLocation ? `<span class="location-badge">📍 ${checkOutLocation.name}</span>` : '—'}</td>
    <td>${checkInTime2 || '—'}</td>
    <td>${checkOutTime2 || '—'}</td>
    <td>${hours}</td>
    <td><span class="status-tag status-present">Present</span></td>
  `;

  if (tbody.rows.length > 0) {
    tbody.insertBefore(newRow, tbody.rows[0]);
  } else {
    tbody.appendChild(newRow);
  }

  if (tbody.rows.length > 6) {
    tbody.removeChild(tbody.rows[tbody.rows.length - 1]);
  }

  updateTotalHours();
}

function updateTotalHours() {
  const tbody = document.querySelector('.attendance-table tbody');
  let totalHours = 0;

  Array.from(tbody.rows).forEach(row => {
    const hoursCell = row.cells[7]?.textContent;
    if (hoursCell) {
      const hours = parseFloat(hoursCell);
      if (!isNaN(hours)) {
        totalHours += hours;
      }
    }
  });

  const tfoot = document.querySelector('.attendance-table tfoot tr');
  if (tfoot && tfoot.cells[5]) {
    tfoot.cells[5].innerHTML = `<strong>${totalHours.toFixed(1)}h</strong>`;
  }
}

function updateAttendanceWithGeoLocation(isClockIn, locationData, time) {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  
  const tbody = document.querySelector('.attendance-table tbody');
  const firstRow = tbody.rows[0];

  if (isClockIn) {
    let todayRow = null;
    for (let i = 0; i < tbody.rows.length; i++) {
      if (tbody.rows[i].cells[0].textContent.includes(today.getDate().toString())) {
        todayRow = tbody.rows[i];
        break;
      }
    }

    if (!todayRow) {
      addAttendanceRecord(
        dateStr,
        time,
        {
          name: locationData.address,
          coords: `${locationData.latitude.toFixed(4)}, ${locationData.longitude.toFixed(4)}`
        },
        null,
        null,
        null,
        null,
        '0h'
      );
    } else {
      const firstCheckInCell = todayRow.cells[1];
      const secondCheckInCell = todayRow.cells[5];
      
      if (!firstCheckInCell.textContent || firstCheckInCell.textContent.trim() === '') {
        firstCheckInCell.textContent = time;
        todayRow.cells[2].innerHTML = `<span class="location-badge">📍 ${locationData.address}</span><br><small style="color: var(--color-on-surface-secondary);">${locationData.latitude.toFixed(4)}, ${locationData.longitude.toFixed(4)}</small>`;
      } else {
        secondCheckInCell.textContent = time;
      }
    }
  } else {
    if (firstRow) {
      const firstCheckOutCell = firstRow.cells[3];
      const secondCheckOutCell = firstRow.cells[6];

      if (!firstCheckOutCell.textContent || firstCheckOutCell.textContent.trim() === '') {
        firstCheckOutCell.textContent = time;
        firstRow.cells[4].innerHTML = `<span class="location-badge">📍 ${locationData.address}</span><br><small style="color: var(--color-on-surface-secondary);">${locationData.latitude.toFixed(4)}, ${locationData.longitude.toFixed(4)}</small>`;
      } else {
        secondCheckOutCell.textContent = time;
      }

      calculateTotalHoursForDay(firstRow);
      updateTotalHours();
    }
  }
}

function calculateTotalHoursForDay(row) {
  try {
    const checkIn1 = row.cells[1].textContent;
    const checkOut1 = row.cells[3].textContent;
    const checkIn2 = row.cells[5].textContent;
    const checkOut2 = row.cells[6].textContent;

    let totalHours = 0;

    if (checkIn1 && checkOut1) {
      const hours1 = parseFloat(calculateHoursWorked(checkIn1, checkOut1));
      totalHours += isNaN(hours1) ? 0 : hours1;
    }

    if (checkIn2 && checkOut2) {
      const hours2 = parseFloat(calculateHoursWorked(checkIn2, checkOut2));
      totalHours += isNaN(hours2) ? 0 : hours2;
    }

    row.cells[7].textContent = totalHours.toFixed(1) + 'h';
  } catch (e) {
    console.error('Error calculating hours:', e);
  }
}

function calculateHoursWorked(startTime, endTime) {
  try {
    const [startHour, startMin] = startTime.match(/\d+/g).slice(0, 2).map(Number);
    const [endHour, endMin] = endTime.match(/\d+/g).slice(0, 2).map(Number);
    const isPM = endTime.includes('PM');
    
    let endHourAdjusted = endHour;
    if (isPM && endHour !== 12) endHourAdjusted = endHour + 12;
    if (!isPM && endHour === 12) endHourAdjusted = 0;

    const startTotalMin = startHour * 60 + startMin;
    const endTotalMin = endHourAdjusted * 60 + endMin;
    const diffMin = endTotalMin - startTotalMin;
    const hours = (diffMin / 60).toFixed(1);

    return hours + 'h';
  } catch (e) {
    return '0h';
  }
}

function initializeScrollReveal() {
  const revealElements = document.querySelectorAll('.feature-card, .process-item, .support-card, .contact-card');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.5s ease-out';
    observer.observe(el);
  });
}

function validateAndApplyDateRange() {
  const dateStartInput = document.getElementById('date-start');
  const dateEndInput = document.getElementById('date-end');
  const applyDateRangeBtn = document.getElementById('apply-date-range');

  const startDate = new Date(dateStartInput.value);
  const endDate = new Date(dateEndInput.value);

  if (startDate > endDate) {
    alert('Start date must be before end date');
    return;
  }

  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  const formattedStart = startDate.toLocaleDateString('en-US', options);
  const formattedEnd = endDate.toLocaleDateString('en-US', options);
  const sectionTitle = document.querySelector('.attendance-services .section-title');
  sectionTitle.textContent = `Attendance (${formattedStart} - ${formattedEnd})`;

  applyDateRangeBtn.textContent = 'Applied!';
  applyDateRangeBtn.style.backgroundColor = 'var(--color-accent)';
  
  setTimeout(() => {
    applyDateRangeBtn.textContent = 'Apply';
    applyDateRangeBtn.style.backgroundColor = '';
  }, 2000);
}

document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  initializeScrollReveal();

  const requestTypeRadios = document.querySelectorAll('input[name="requestType"]');
  const additionalInfoSection = document.getElementById('additionalInfoSection');
  const itrFields = document.getElementById('itrFields');
  const payslipFields = document.getElementById('payslipFields');

  requestTypeRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.value === 'ITR') {
        additionalInfoSection.style.display = 'block';
        itrFields.style.display = 'block';
        payslipFields.style.display = 'none';
      } else if (this.value === 'Payslip') {
        additionalInfoSection.style.display = 'block';
        itrFields.style.display = 'none';
        payslipFields.style.display = 'block';
      } else {
        additionalInfoSection.style.display = 'none';
        itrFields.style.display = 'none';
        payslipFields.style.display = 'none';
      }
    });
  });

  const hrRequestForm = document.getElementById('hrRequestForm');
  if (hrRequestForm) {
    hrRequestForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const requestType = document.querySelector('input[name="requestType"]:checked').value;
      const employeeRemarks = document.getElementById('employeeRemarks').value;
      
      let additionalData = {};
      if (requestType === 'ITR') {
        additionalData = {
          itrName: document.getElementById('itrName').value,
          itrEmail: document.getElementById('itrEmail').value
        };
      } else if (requestType === 'Payslip') {
        additionalData = {
          payslipName: document.getElementById('payslipName').value,
          payslipCTC: document.getElementById('payslipCTC').value,
          payslipMonth: document.getElementById('payslipMonth').value
        };
      }

      const requestData = {
        employeeId: EMPLOYEE_ID,
        requestType: requestType,
        employeeRemarks: employeeRemarks,
        additionalData: additionalData,
        status: 'Pending',
        submittedDate: new Date().toISOString()
      };

      console.log('HR Request Submitted:', requestData);
      alert(`${requestType} request submitted successfully!`);
      closeHRRequestModal();

      // In production, send this to backend:
      // const response = await fetch('/api/hr-requests', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(requestData)
      // });
    });
  }

  const hrRequestModal = document.getElementById('hrRequestModal');
  if (hrRequestModal) {
    hrRequestModal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeHRRequestModal();
      }
    });
  }

  const filingForm = document.getElementById('filingForm');
  if (filingForm) {
    filingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const filingType = document.querySelector('input[name="filingType"]:checked').value;
      const employeeRemarks = document.getElementById('filingEmployeeRemarks').value;

      const filingData = {
        employeeId: EMPLOYEE_ID,
        filingType: filingType,
        employeeRemarks: employeeRemarks,
        status: 'Pending',
        submittedDate: new Date().toISOString()
      };

      console.log('Filing Submitted:', filingData);
      alert(`${filingType} submitted successfully!`);
      closeFilingModal();

      // In production, send to backend:
      // await fetch('/api/filings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(filingData)
      // });
    });
  }

  const filingModal = document.getElementById('filingModal');
  if (filingModal) {
    filingModal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeFilingModal();
      }
    });
  }

  const expenseClaimForm = document.getElementById('expenseClaimForm');
  if (expenseClaimForm) {
    expenseClaimForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const expenseType = document.querySelector('input[name="expenseType"]:checked').value;
      const amount = document.getElementById('expenseAmount').value;
      const description = document.getElementById('expenseDescription').value;
      const expenseDate = document.getElementById('expenseDate').value;
      const employeeRemarks = document.getElementById('expenseEmployeeRemarks').value;

      const expenseData = {
        employeeId: EMPLOYEE_ID,
        expenseType: expenseType,
        amount: parseFloat(amount),
        description: description,
        expenseDate: expenseDate,
        employeeRemarks: employeeRemarks,
        status: 'Pending',
        submittedDate: new Date().toISOString()
      };

      console.log('Expense Claim Submitted:', expenseData);
      alert(`${expenseType} expense claim for PHP ${amount} submitted successfully!`);
      closeExpenseClaimModal();

      // In production, send to backend:
      // await fetch('/api/expense-claims', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(expenseData)
      // });
    });
  }

  const expenseClaimModal = document.getElementById('expenseClaimModal');
  if (expenseClaimModal) {
    expenseClaimModal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeExpenseClaimModal();
      }
    });
  }

  function attachModalCloseListener(modalId, closeCallback) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === this) {
          closeCallback();
        }
      });
    }
  }

  attachModalCloseListener('filingCalendarModal', closeFilingCalendar);
  attachModalCloseListener('expenseCalendarModal', closeExpenseCalendar);
  attachModalCloseListener('personalInfoModal', closePersonalInfoModal);
  attachModalCloseListener('filedOvertimeModal', closeFiledOvertimeModal);
  attachModalCloseListener('leaveLedgerModal', closeLeaveLedgerModal);
  attachModalCloseListener('changePasswordModal', closeChangePasswordModal);

  const signOutBtn = document.getElementById('sign-out-btn');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (confirm('Are you sure you want to sign out?')) {
        this.textContent = 'Signing Out...';
        this.disabled = true;
        
        setTimeout(() => {
          window.location.href = './login.html';
        }, 1000);
      }
    });
  }

  const actionButtons = document.querySelectorAll('.action-trigger');
  actionButtons.forEach(button => {
    button.addEventListener('click', async function() {
      const isClockIn = this.textContent.includes('Clock In');
      const isClockOut = this.textContent.includes('Clock Out') || this.textContent.includes('Clock Out');
      
      if (!isClockIn && !isClockOut) {
        const originalText = this.innerHTML;
        this.innerHTML = 'Processing...';
        this.disabled = true;
        
        setTimeout(() => {
          this.innerHTML = 'Success!';
          this.style.backgroundColor = 'var(--color-accent)';
          
          setTimeout(() => {
            this.innerHTML = originalText;
            this.disabled = false;
            this.style.backgroundColor = '';
          }, 2000);
        }, 1000);
        return;
      }

      const originalText = this.innerHTML;
      this.innerHTML = 'Getting location...';
      this.disabled = true;

      try {
        let result;
        if (isClockIn) {
          result = await GeolocationService.sendTimeIn(EMPLOYEE_ID);
        } else {
          result = await GeolocationService.sendTimeOut(EMPLOYEE_ID);
        }

        if (result.success) {
          this.innerHTML = '✓ Success!';
          this.style.backgroundColor = 'var(--color-accent)';

          const locationData = result.data.data.location;
          const timestamp = new Date(result.data.data.timestamp);
          const timeStr = timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });  
          console.log(`${isClockIn ? 'Clocked In' : 'Clocked Out'} at:`, locationData);

          updateAttendanceWithGeoLocation(isClockIn, locationData, timeStr);

          showLocationNotification(
            isClockIn ? 'Clocked In' : 'Clocked Out',
            locationData.address,
            locationData
          );

          const self = this;
          setTimeout(() => {
            if (isClockIn) {
              self.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8m-4-4v8"/></g></svg>\n            Clock Out';
              self.classList.remove('btn-primary');
              self.classList.add('btn-secondary');
            } else {
              self.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8m-4-4v8"/></g></svg>\n            Clock In';
              self.classList.remove('btn-secondary');
              self.classList.add('btn-primary');
            }
            self.disabled = false;
            self.style.backgroundColor = '';
          }, 3000);
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('Error:', error);
        this.innerHTML = '✗ Error';
        this.style.backgroundColor = '#dc3545';

        showErrorNotification(error.message);
        
        setTimeout(() => {
          this.innerHTML = originalText;
          this.disabled = false;
          this.style.backgroundColor = '';
        }, 3000);
      }
    });
  });

  const applyDateRangeBtn = document.getElementById('apply-date-range');
  if (applyDateRangeBtn) {
    applyDateRangeBtn.addEventListener('click', validateAndApplyDateRange);

    const dateEndInput = document.getElementById('date-end');
    if (dateEndInput) {
      dateEndInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          validateAndApplyDateRange();
        }
      });
    }
  }
  initializeClockStatus();
});
