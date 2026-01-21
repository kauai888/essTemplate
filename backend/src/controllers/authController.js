const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Dummy users (replace with DB later)
const users = [
  { id: 1, username: 'employee1', password: bcrypt.hashSync('password123', 8), role: 'employee', email: 'employee1@company.com', phone: '+639171234567' },
  { id: 2, username: 'manager1', password: bcrypt.hashSync('managerpass', 8), role: 'approver', email: 'manager1@company.com', phone: '+639175678901' }
];

// In-memory OTP storage (use Redis in production)
const otpStore = {};

// Generate random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.login = (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const validPassword = bcrypt.compareSync(password, user.password);
  if (!validPassword) return res.status(401).json({ message: 'Invalid password' });

  // Generate OTP
  const otp = generateOTP();
  const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  otpStore[user.id] = { otp, otpExpiry, phone: user.phone };

  // In production, send OTP via SMS gateway (e.g., Twilio, AWS SNS, local SMS provider)
  // Example: await sendSMS(user.phone, `Your OTP is: ${otp}`);
  console.log(`[SIM/SMS] OTP for user ${username} sent to ${user.phone}: ${otp}`);

  res.json({
    message: 'OTP sent to registered phone number via SIM',
    userId: user.id,
    phone: user.phone,
    requiresOTP: true
  });
};

exports.verifyOTP = (req, res) => {
  const { userId, otp } = req.body;

  if (!otpStore[userId]) {
    return res.status(400).json({ message: 'OTP expired or not found' });
  }

  const { otp: storedOTP, otpExpiry } = otpStore[userId];

  // Check expiry
  if (Date.now() > otpExpiry) {
    delete otpStore[userId];
    return res.status(400).json({ message: 'OTP expired' });
  }

  // Check OTP
  if (otp !== storedOTP) {
    return res.status(401).json({ message: 'Invalid OTP' });
  }

  // OTP verified, generate JWT token
  const user = users.find(u => u.id === userId);
  const token = jwt.sign({ id: user.id, role: user.role }, 'secretKey', { expiresIn: '1h' });

  // Clear OTP
  delete otpStore[userId];

  res.json({
    message: 'Login successful',
    token,
    role: user.role,
    userId: user.id
  });
};
