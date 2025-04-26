const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  oauthId: { type: String, required: true },
  provider: { type: String, enum: ['google', 'github'], required: true },
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String },
  avatar: String,
  role: {
    type: String,
    enum: ['admin', 'editor', 'viewer'],
    default: 'viewer',
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
