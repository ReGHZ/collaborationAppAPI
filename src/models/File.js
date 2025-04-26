const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true,
  },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  filename: String,
  originalname: String,
  mimetype: String,
  size: Number,
  url: String,
  chunks: [String], // Untuk chunking file besar
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('File', FileSchema);
