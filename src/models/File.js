import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
  {
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
    },
    filename: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    chunks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FileChunk' }],
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isUploadComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('File', fileSchema);
