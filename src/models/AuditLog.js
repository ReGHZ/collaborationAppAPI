import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: {
      type: String,
      enum: ['create', 'update', 'delete', 'share', 'permission_change'],
      required: true,
    },
    metadata: mongoose.Schema.Types.Mixed,
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
);

auditLogSchema.index({ document: 1, createdAt: -1 });
export default mongoose.model('AuditLog', auditLogSchema);
