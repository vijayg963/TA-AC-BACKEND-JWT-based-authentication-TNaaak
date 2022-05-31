const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  author: String,
  price: Number,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  tags: [{ type: String }],
});

module.exports = mongoose.model('Book', bookSchema);
