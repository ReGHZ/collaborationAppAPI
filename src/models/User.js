import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      validate: {
        validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: 'Invalid email format',
      },
    },
    googleId: String,
    githubId: String,
    refreshTokens: [String], // Untuk menyimpan refresh tokens
    displayName: String,
    avatar: String,
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    lastActive: Date,
    documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
