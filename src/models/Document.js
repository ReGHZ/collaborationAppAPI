import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: mongoose.Schema.Types.Mixed,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    permissions: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        level: { type: String, enum: ['view', 'edit'] },
      },
    ],
    fileType: { type: String, enum: ['text', 'whiteboard'], required: true },
    currentVersion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DocumentVersion',
    },
    collaborators: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        cursorPosition: Number,
        lastActive: Date,
      },
    ],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

documentSchema.index({ title: 'text', content: 'text' });
export default mongoose.model('Document', documentSchema);
