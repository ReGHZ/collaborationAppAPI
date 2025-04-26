const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  versions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Version' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
  whiteboard: { type: Object, default: {} },
  permission: { type: String, enum: ['private', 'public'], default: 'private' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Document', DocumentSchema);
