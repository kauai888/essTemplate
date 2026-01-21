const express = require('express');
const router = express.Router();

router.post('/employees', (req, res) => {
  const { employeeId, name, email, position, password, status } = req.body;

  console.log('Creating employee:', { employeeId, name, email, position, status });
  
  res.json({
    success: true,
    message: 'Employee created successfully',
    employeeId: employeeId
  });
});

router.get('/employees', (req, res) => {

  res.json({
    success: true,
    employees: [
      {
        employeeId: 'EMP001',
        name: 'John Doe',
        email: 'john@company.com',
        position: 'Software Engineer',
        status: 'Active'
      },
      {
        employeeId: 'EMP002',
        name: 'Jane Smith',
        email: 'jane@company.com',
        position: 'HR Manager',
        status: 'Active'
      }
    ]
  });
});

router.put('/employees/:employeeId', (req, res) => {
  const { employeeId } = req.params;
  const { name, email, position, status } = req.body;

  console.log('Updating employee:', employeeId, { name, email, position, status });
  
  res.json({
    success: true,
    message: 'Employee updated successfully'
  });
});

router.delete('/employees/:employeeId', (req, res) => {
  const { employeeId } = req.params;

  console.log('Deleting employee:', employeeId);
  
  res.json({
    success: true,
    message: 'Employee deleted successfully'
  });
});

router.put('/attendance/:employeeId/:date', (req, res) => {
  const { employeeId, date } = req.params;
  const { clockIn, clockOut } = req.body;

  console.log('Updating attendance:', { employeeId, date, clockIn, clockOut });
  
  res.json({
    success: true,
    message: 'Attendance updated successfully'
  });
});

router.get('/attendance', (req, res) => {
  const { employeeId, date } = req.query;

  res.json({
    success: true,
    attendance: [
      {
        employeeId: 'EMP001',
        name: 'John Doe',
        date: '2026-01-13',
        clockIn: '08:00',
        clockOut: '17:30'
      }
    ]
  });
});

router.put('/leave-balance/:employeeId', (req, res) => {
  const { employeeId } = req.params;
  const { annualLeave, sickLeave, emergencyLeave } = req.body;

  console.log('Updating leave balance:', { employeeId, annualLeave, sickLeave, emergencyLeave });
  
  res.json({
    success: true,
    message: 'Leave balance updated successfully'
  });
});

router.get('/leave-balance', (req, res) => {

  res.json({
    success: true,
    leaveBalances: [
      {
        employeeId: 'EMP001',
        name: 'John Doe',
        annualLeave: 15,
        sickLeave: 10,
        emergencyLeave: 3
      }
    ]
  });
});

router.post('/announcements', (req, res) => {
  const { title, content, date, pinned } = req.body;

  console.log('Creating announcement:', { title, date, pinned });
  
  res.json({
    success: true,
    message: 'Announcement created successfully',
    announcementId: Date.now()
  });
});

router.get('/announcements', (req, res) => {

  res.json({
    success: true,
    announcements: [
      {
        id: 1,
        title: 'Pag-ibig loan application',
        content: '<a href="#"><u>see the attached file</u></a> for guidelines. ',
        date: 'Oct 24, 2025',
        pinned: true
      },
      {
        id: 2,
        title: 'Loans SSS, PhilHealth',
        content: '<a href="#"><u>see the attached file</u></a> for guidelines.',
        date: 'Oct 20, 2025',
        pinned: false
      }
    ]
  });
});

router.put('/announcements/:announcementId', (req, res) => {
  const { announcementId } = req.params;
  const { title, content, date, pinned } = req.body;

  console.log('Updating announcement:', announcementId, { title, date, pinned });
  
  res.json({
    success: true,
    message: 'Announcement updated successfully'
  });
});

router.delete('/announcements/:announcementId', (req, res) => {
  const { announcementId } = req.params;

  console.log('Deleting announcement:', announcementId);
  
  res.json({
    success: true,
    message: 'Announcement deleted successfully'
  });
});

module.exports = router;
