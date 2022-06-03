const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var commentSchema = new Schema(
  {
    body: { type: String, require: true },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    articleId: { type: Schema.Types.ObjectId, ref: 'Article' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
