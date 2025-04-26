import mongoose from 'mongoose';

const documentVersionSchema = new mongoose.Schema({
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true,
  },
  contentSnapshot: mongoose.Schema.Types.Mixed,
  diff: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parentVersion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DocumentVersion',
  }, // For version tree
});

documentVersionSchema.index({ document: 1, createdAt: -1 });
export default mongoose.model('DocumentVersion', documentVersionSchema);
