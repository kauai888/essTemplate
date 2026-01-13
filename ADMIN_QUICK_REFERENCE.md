# Admin Panel - Quick Reference Guide

## 🚀 Quick Start

### Access Admin Panel
- Click "Admin Panel" button on dashboard
- Or go to: `pages/admin.html`

## 📋 Main Sections

### 1️⃣ Employees Tab
**What**: Manage employee accounts
**Can Do**:
- ✅ Create new employees with login credentials
- ✅ Edit employee details
- ✅ Delete employees
- ✅ Search employees
- ✅ View all employees

**Key Info**: Password is required when creating. Use strong passwords.

---

### 2️⃣ Attendance Tab
**What**: Adjust employee attendance records
**Can Do**:
- ✅ Edit clock-in times
- ✅ Edit clock-out times
- ✅ Correct past attendance records
- ✅ Search by employee name

**Key Info**: Date field allows you to select any date to correct historical records.

---

### 3️⃣ Leave Balance Tab
**What**: Manage leave entitlements
**Can Do**:
- ✅ Update Annual Leave days
- ✅ Update Sick Leave days
- ✅ Update Emergency Leave days
- ✅ Search for employees

**Key Info**: Values are in days. Update as needed based on company policy.

---

### 4️⃣ Announcements Tab
**What**: Post company announcements
**Can Do**:
- ✅ Create new announcements
- ✅ Edit announcements
- ✅ Delete announcements
- ✅ Pin important announcements
- ✅ Set announcement dates

**Key Info**: Pinned announcements appear at the top. Use for urgent company news.

---

## 🎯 Common Tasks

### Task 1: Add New Employee
1. Go to **Employees** tab
2. Click **+ Create Employee**
3. Fill in:
   - Employee ID (e.g., EMP001)
   - Full Name
   - Email
   - Position
   - Password (and confirm)
4. Click **Save Employee**

### Task 2: Fix Attendance Record
1. Go to **Attendance** tab
2. Find employee in table
3. Click **✎ (Edit)** button
4. Update clock times
5. Click **Update Attendance**

### Task 3: Update Leave Balance
1. Go to **Leave Balance** tab
2. Find employee in table
3. Click **✎ (Edit)** button
4. Update leave days
5. Click **Update Leave Balance**

### Task 4: Post Announcement
1. Go to **Announcements** tab
2. Click **+ Create Announcement**
3. Fill in:
   - Title
   - Content
   - Date
   - Check "Pin" if urgent
4. Click **Save Announcement**

---

## 🔍 Features

### Search Functionality
- All tabs have search boxes
- Search by name or ID
- Real-time filtering

### Modal Forms
- Click outside modal to close
- Or click "Cancel" button
- "X" button closes without saving

### Status Indicators
- 🟢 Active = Employee is active
- 📌 Pinned = Important announcement

### Action Buttons
- **✎** = Edit
- **🗑** = Delete
- **+** = Create new

---

## ⚙️ Settings

### Employee Status
- **Active**: Employee can log in
- **Inactive**: Employee blocked from logging in

### Password Management
- Passwords are required for new employees
- Passwords must be confirmed (typed twice)
- Each employee gets unique login

---

## 🔐 Security Tips

✅ **DO**:
- Use strong passwords (mix of letters, numbers, special chars)
- Verify email addresses are correct
- Use employee IDs consistently (e.g., EMP001, EMP002)
- Pin important announcements

❌ **DON'T**:
- Share admin panel access with non-admins
- Use weak passwords
- Store passwords in plain text
- Delete active employees without notice

---

## 📊 Data Management

### Bulk Operations (Future)
- Coming soon: CSV import/export
- Coming soon: Bulk updates

### Backups
- Ensure database is backed up regularly
- Keep admin logs for audit trail

---

## 🐛 Troubleshooting

### Issue: Form won't submit
**Solution**: Check that all required fields are filled (marked with *)

### Issue: Employee creation failed
**Solution**: Verify passwords match and employee ID is unique

### Issue: Search not working
**Solution**: Click in search box and start typing

### Issue: Modal won't close
**Solution**: Click the X button or click outside the modal

---

## 📞 Support

For technical issues:
1. Check browser console (F12 → Console tab)
2. Verify server is running
3. Test API endpoints
4. Check network tab for failed requests

---

## 🎓 Tips & Tricks

💡 **Pro Tips**:
- Use consistent date format (YYYY-MM-DD)
- Organize announcements by priority
- Review employee list monthly
- Archive old announcements
- Keep leave balance records updated

---

**Version**: 1.0
**Last Updated**: January 13, 2026
**Status**: ✅ Production Ready (with backend integration)
