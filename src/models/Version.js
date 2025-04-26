const mongoose = require('mongoose');

const VersionSchema = new mongoose.Schema({
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true,
  },
  content: String,
  diff: Object,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now, index: { expires: '30d' } }, // TTL 30 hari
});

module.exports = mongoose.model('Version', VersionSchema);
