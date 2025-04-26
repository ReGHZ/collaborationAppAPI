const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: String,
  document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  detail: Object,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
