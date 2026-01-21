const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Redis = require('redis');

const redisClient = process.env.CACHE_PROVIDER === 'redis' ? Redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || null
}) : null;

const otpStoreFallback = {};

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function storeOTP(userId, otp, phone) {
  const otpExpiry = Date.now() + (parseInt(process.env.OTP_EXPIRY_MINUTES || 10) * 60 * 1000);
  
  if (redisClient && redisClient.connected) {
    await redisClient.setex(
      `otp:${userId}`,
      parseInt(process.env.OTP_EXPIRY_MINUTES || 10) * 60,
      JSON.stringify({ otp, otpExpiry, phone, attempts: 0 })
    );
  } else {
    otpStoreFallback[userId] = { otp, otpExpiry, phone, attempts: 0 };
  }
}

async function getOTP(userId) {
  if (redisClient && redisClient.connected) {
    const data = await redisClient.get(`otp:${userId}`);
    return data ? JSON.parse(data) : null;
  } else {
    return otpStoreFallback[userId] || null;
  }
}

async function deleteOTP(userId) {
  if (redisClient && redisClient.connected) {
    await redisClient.del(`otp:${userId}`);
  } else {
    delete otpStoreFallback[userId];
  }
}

/**
 * Login Endpoint
 * Authenticates user and sends OTP
 * @route POST /api/auth/login
 * @requires username, password
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Username and password are required' 
      });
    }

    // TODO: Fetch user from database
    // const user = await User.findOne({ username });
    // if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    // TODO: Validate password
    // const validPassword = await bcrypt.compare(password, user.password_hash);
    // if (!validPassword) return res.status(401).json({ success: false, message: 'Invalid password' });

    // Generate OTP
    const otp = generateOTP();
    const userId = 'user_id_from_db';
    const phone = 'phone_from_db';
    
    await storeOTP(userId, otp, phone);

    console.log(`[OTP] User ${username} - OTP: ${otp} (Valid for ${process.env.OTP_EXPIRY_MINUTES || 10} minutes)`);

    res.json({
      success: true,
      message: 'OTP sent to registered phone number',
      data: {
        userId,
        phone: phone ? phone.slice(-4) : 'hidden',
        requiresOTP: true
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

/**
 * Verify OTP Endpoint
 * Verifies OTP and issues JWT token
 * @route POST /api/auth/verify-otp
 * @requires userId, otp
 */
exports.verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ 
        success: false,
        message: 'userId and otp are required' 
      });
    }

    const storedOTPData = await getOTP(userId);

    if (!storedOTPData) {
      return res.status(400).json({ 
        success: false,
        message: 'OTP expired or not found' 
      });
    }

    const { otp: storedOTP, otpExpiry, attempts } = storedOTPData;

    if (attempts >= parseInt(process.env.OTP_MAX_ATTEMPTS || 3)) {
      await deleteOTP(userId);
      return res.status(429).json({ 
        success: false,
        message: 'Maximum OTP attempts exceeded. Please request a new OTP.' 
      });
    }

    if (Date.now() > otpExpiry) {
      await deleteOTP(userId);
      return res.status(400).json({ 
        success: false,
        message: 'OTP expired. Please request a new OTP.' 
      });
    }

    if (otp !== storedOTP) {

      storedOTPData.attempts = attempts + 1;
      if (redisClient && redisClient.connected) {
        await redisClient.setex(
          `otp:${userId}`,
          parseInt(process.env.OTP_EXPIRY_MINUTES || 10) * 60,
          JSON.stringify(storedOTPData)
        );
      } else {
        otpStoreFallback[userId] = storedOTPData;
      }
      
      return res.status(401).json({ 
        success: false,
        message: 'Invalid OTP' 
      });
    }

    const token = jwt.sign(
      { userId, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    await deleteOTP(userId);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        refreshToken,
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
        userId
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during OTP verification'
    });
  }
};
