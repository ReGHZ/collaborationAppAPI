import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
    },
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    resolved: { type: Boolean, default: false },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }, // Threaded comments
  },
  { timestamps: true }
);

commentSchema.index({ document: 1, createdAt: -1 });
export default mongoose.model('Comment', commentSchema);
