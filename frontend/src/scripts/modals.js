// ATTENDANCE LOG MODAL FUNCTIONS
function openAttendanceLogModal(e) {
  if (e) e.preventDefault();
  document.getElementById('attendanceLogModal').style.display = 'flex';
  populateAttendanceTable([]);
}

function closeAttendanceLogModal() {
  document.getElementById('attendanceLogModal').style.display = 'none';
}

function filterAttendanceByDateRange() {
  const fromDate = document.getElementById('modal-date-from').value;
  const toDate = document.getElementById('modal-date-to').value;
  
  if (!fromDate || !toDate) {
    alert('Please select both From and To dates');
    return;
  }
  
  const from = new Date(fromDate);
  const to = new Date(toDate);
  
  if (from > to) {
    alert('From date must be before To date');
    return;
  }
  
  alert('No attendance records found in the selected date range');
  populateAttendanceTable([]);
}

function populateAttendanceTable(records) {
  const tbody = document.getElementById('attendanceTableBody');
  tbody.innerHTML = '';
  
  records.slice(0, 100).forEach(record => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${record.date}</td>
      <td><strong>${record.timeIn1}</strong></td>
      <td><small style="display: block; color: #666; margin-top: 3px;">📍 ${record.locIn1}</small></td>
      <td><strong>${record.timeOut1}</strong></td>
      <td><small style="display: block; color: #666; margin-top: 3px;">📍 ${record.locOut1}</small></td>
      <td><strong>${record.timeIn2}</strong></td>
      <td><small style="display: block; color: #666; margin-top: 3px;">📍 ${record.locIn2}</small></td>
      <td><strong>${record.timeOut2}</strong></td>
      <td><small style="display: block; color: #666; margin-top: 3px;">📍 ${record.locOut2}</small></td>
      <td><strong>${record.timeIn3}</strong></td>
      <td><small style="display: block; color: #666; margin-top: 3px;">📍 ${record.locIn3}</small></td>
      <td><strong>${record.timeOut3}</strong></td>
      <td><small style="display: block; color: #666; margin-top: 3px;">📍 ${record.locOut3}</small></td>
      <td><strong>${record.hours}</strong></td>
      <td><span class="status-tag status-present">${record.status}</span></td>
    `;
    row.style.borderBottom = '1px solid #ddd';
    tbody.appendChild(row);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const attendanceLogModal = document.getElementById('attendanceLogModal');
  if (attendanceLogModal) {
    attendanceLogModal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeAttendanceLogModal();
      }
    });
  }
});

//LEAVE FILING MODAL FUNCTIONS
function openLeaveFilingModal(e) {
  if (e) e.preventDefault();
  document.getElementById('leaveFilingModal').style.display = 'flex';
  document.getElementById('leaveFilingForm').reset();
  document.getElementById('vlOptionsSection').style.display = 'none';
}

function closeLeaveFilingModal() {
  document.getElementById('leaveFilingModal').style.display = 'none';
  document.getElementById('leaveFilingForm').reset();
  document.getElementById('vlOptionsSection').style.display = 'none';
}

function showLeaveOptions() {
  const selectedLeave = document.querySelector('input[name="leaveType"]:checked').value;
  const vlOptionsSection = document.getElementById('vlOptionsSection');

  if (selectedLeave === 'VL-Vacation Leave') {
    vlOptionsSection.style.display = 'block';
    document.querySelectorAll('input[name="vlDuration"]').forEach(input => {
      input.required = true;
    });
  } else {
    vlOptionsSection.style.display = 'none';
    document.querySelectorAll('input[name="vlDuration"]').forEach(input => {
      input.required = false;
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const leaveFilingForm = document.getElementById('leaveFilingForm');
  if (leaveFilingForm) {
    leaveFilingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const leaveType = document.querySelector('input[name="leaveType"]:checked').value;
      const fromDate = document.getElementById('leaveFromDate').value;
      const toDate = document.getElementById('leaveToDate').value;
      const reason = document.getElementById('leaveReason').value;

      if (!fromDate || !toDate) {
        alert('Please select both From and To dates');
        return;
      }
      
      const from = new Date(fromDate);
      const to = new Date(toDate);
      
      if (from > to) {
        alert('From date must be before or equal to To date');
        return;
      }
      
      let duration = '';
      if (leaveType === 'VL-Vacation Leave') {
        const selectedDuration = document.querySelector('input[name="vlDuration"]:checked');
        if (!selectedDuration) {
          alert('Please select leave duration for Vacation Leave');
          return;
        }
        duration = selectedDuration.value;
      }

      const submissionData = {
        leaveType: leaveType,
        duration: duration,
        fromDate: fromDate,
        toDate: toDate,
        reason: reason,
        submittedAt: new Date().toLocaleString()
      };
      
      console.log('Leave Filing Submitted:', submissionData);
      alert(`Leave request submitted successfully!\n\nType: ${leaveType}${duration ? '\nDuration: ' + duration : ''}\nFrom: ${fromDate}\nTo: ${toDate}`);
      closeLeaveFilingModal();
    });
  }

  const leaveFilingModal = document.getElementById('leaveFilingModal');
  if (leaveFilingModal) {
    leaveFilingModal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeLeaveFilingModal();
      }
    });
  }
});

// OVERTIME FILING MODAL FUNCTIONS
function openOvertimeFilingModal(e) {
  if (e) e.preventDefault();
  document.getElementById('overtimeFilingModal').style.display = 'flex';
  document.getElementById('overtimeFilingForm').reset();
  document.getElementById('overtimeTimeDetails').style.display = 'none';
}

function closeOvertimeFilingModal() {
  document.getElementById('overtimeFilingModal').style.display = 'none';
  document.getElementById('overtimeFilingForm').reset();
  document.getElementById('overtimeTimeDetails').style.display = 'none';
}

function openOvertimeTimeFilingPanel() {
  const panel = document.getElementById('overtimeTimeDetails');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

function openOvertimeCalendar() {
  alert('Calendar view for Overtime Filing (Feature to be implemented)');
}

document.addEventListener('DOMContentLoaded', function() {
  const overtimeFilingForm = document.getElementById('overtimeFilingForm');
  if (overtimeFilingForm) {
    overtimeFilingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const fromDate = document.getElementById('otFromDate').value;
      const toDate = document.getElementById('otToDate').value;
      const timeIn = document.getElementById('otTimeIn').value;
      const timeOut = document.getElementById('otTimeOut').value;
      const remarks = document.getElementById('otRemarks').value;

      if (!fromDate || !toDate) {
        alert('Please select both From and To dates');
        return;
      }

      console.log('OT Filing Submitted:', { fromDate, toDate, timeIn, timeOut, remarks });
      alert(`Overtime filing submitted!\nPeriod: ${fromDate} to ${toDate}`);
      closeOvertimeFilingModal();
    });
  }

  const overtimeFilingModal = document.getElementById('overtimeFilingModal');
  if (overtimeFilingModal) {
    overtimeFilingModal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeOvertimeFilingModal();
      }
    });
  }
});

//OB FILING MODAL FUNCTIONS
function openOBFilingModal(e) {
  if (e) e.preventDefault();
  document.getElementById('obFilingModal').style.display = 'flex';
  document.getElementById('obFilingForm').reset();
  document.getElementById('obTimeDetails').style.display = 'none';
}

function closeOBFilingModal() {
  document.getElementById('obFilingModal').style.display = 'none';
  document.getElementById('obFilingForm').reset();
  document.getElementById('obTimeDetails').style.display = 'none';
}

function openOBTimeFilingPanel() {
  const panel = document.getElementById('obTimeDetails');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

function openOBCalendar() {
  alert('Calendar view for OB Filing (Feature to be implemented)');
}

document.addEventListener('DOMContentLoaded', function() {
  const obFilingForm = document.getElementById('obFilingForm');
  if (obFilingForm) {
    obFilingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const fromDate = document.getElementById('obFromDate').value;
      const toDate = document.getElementById('obToDate').value;
      const timeIn = document.getElementById('obTimeIn').value;
      const timeOut = document.getElementById('obTimeOut').value;
      const purpose = document.getElementById('obPurpose').value;

      if (!fromDate || !toDate) {
        alert('Please select both From and To dates');
        return;
      }

      console.log('OB Filing Submitted:', { fromDate, toDate, timeIn, timeOut, purpose });
      alert(`OB filing submitted!\nPeriod: ${fromDate} to ${toDate}`);
      closeOBFilingModal();
    });
  }

  const obFilingModal = document.getElementById('obFilingModal');
  if (obFilingModal) {
    obFilingModal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeOBFilingModal();
      }
    });
  }
});

// 201 UPDATES MODAL FUNCTIONS
function open201UpdatesModal(e) {
  if (e) e.preventDefault();
  document.getElementById('updates201Modal').style.display = 'flex';
  document.getElementById('updates201Form').reset();
}

function close201UpdatesModal() {
  document.getElementById('updates201Modal').style.display = 'none';
  document.getElementById('updates201Form').reset();
}

function open201Calendar() {
  alert('Calendar view for 201 Updates (Feature to be implemented)');
}

document.addEventListener('DOMContentLoaded', function() {
  const updates201Form = document.getElementById('updates201Form');
  if (updates201Form) {
    updates201Form.addEventListener('submit', function(e) {
      e.preventDefault();
      const fromDate = document.getElementById('u201FromDate').value;
      const toDate = document.getElementById('u201ToDate').value;
      const selectedFields = Array.from(document.querySelectorAll('input[name="u201Fields"]:checked')).map(el => el.value);

      if (!fromDate || !toDate) {
        alert('Please select both From and To dates');
        return;
      }

      if (selectedFields.length === 0) {
        alert('Please select at least one field to update');
        return;
      }

      console.log('201 Updates Submitted:', { fromDate, toDate, fields: selectedFields });
      alert(`201 Updates submitted!\nEffective Period: ${fromDate} to ${toDate}\nFields Updated: ${selectedFields.length}`);
      close201UpdatesModal();
    });
  }

  const updates201Modal = document.getElementById('updates201Modal');
  if (updates201Modal) {
    updates201Modal.addEventListener('click', function(e) {
      if (e.target === this) {
        close201UpdatesModal();
      }
    });
  }
});

// PAYSLIP MODAL FUNCTIONS
function openPayslipModal(e) {
  if (e) e.preventDefault();
  document.getElementById('payslipModal').style.display = 'flex';
}

function closePayslipModal() {
  document.getElementById('payslipModal').style.display = 'none';
}

function downloadPayslipPDF() {
  // In production, this would generate a PDF using a library like jsPDF
  alert('PDF download initiated. (In production, use jsPDF library)');

    
    // Example implementation with jsPDF:
    // const element = document.querySelector('.payslip-content');
    // const opt = {
    //   margin: 10,
    //   filename: 'payslip-september-2026.pdf',
    //   image: { type: 'jpeg', quality: 0.98 },
    //   html2canvas: { scale: 2 },
    //   jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    // };
    // html2pdf().set(opt).from(element).save();

}

document.addEventListener('DOMContentLoaded', function() {
  const payslipModal = document.getElementById('payslipModal');
  if (payslipModal) {
    payslipModal.addEventListener('click', function(e) {
      if (e.target === this) {
        closePayslipModal();
      }
    });
  }
});
