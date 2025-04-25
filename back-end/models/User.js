const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['teacher', 'student'], required: true },
  resetToken: { type: String, default: null }, // Field to store reset token (optional)
  resetTokenExpiration: { type: Date, default: null } // Field for expiration time (optional)
}, { collection: 'users' });

module.exports = mongoose.model('User', UserSchema);
