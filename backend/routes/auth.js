const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const OTP_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes

// Store OTPs temporarily in memory
let otpStore = {};

// Send OTP for Password Reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate a 6-digit OTP
    const OTP = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = { OTP, expiresAt: Date.now() + OTP_EXPIRATION_TIME };

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    // Send OTP via email
    const mailOptions = {
      from: process.env.MY_EMAIL,
      to: email,
      subject: 'Password Reset OTP',
      html: `<p>Your OTP for password reset is: <strong>${OTP}</strong></p><p>It is valid for 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'OTP sent to your email.' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP.' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, OTP, newPassword } = req.body;

    // Check if OTP is valid
    const otpData = otpStore[email];
    if (!otpData || otpData.OTP !== parseInt(OTP) || Date.now() > otpData.expiresAt) {
      return res.status(400).json({ error: 'Invalid or expired OTP.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.password = hashedPassword;
    await user.save();

    // Clear OTP from memory
    delete otpStore[email];

    res.json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password.' });
  }
});

// Login Route (Existing)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Update Password Route (Existing)
router.post('/update-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update password' });
  }
});

module.exports = router;
