var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var slugger = require('slugger');
var User = require('./User');
var randomNumber = middleware.randomNumber;
let methods = require('../middleware/formatdata');

var articleSchema = new Schema(
  {
    title: { type: String, require: true },
    slug: { type: String, require: true, unique: true },
    description: { type: String, required: true },
    body: { type: String, required: true },
    tagList: [{ type: String }],
    likes: { type: Number, default: 0 },
    author: { type: Object, require: true },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    favoritedCount: { type: Number, default: 0 },
    favoriteList: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

articleSchema.pre('save', async (next) => {
  this.slug = this.title + '_' + randomNumber();
  this.slug = this.slug.split(',').join('-');
  next();
});

module.exports = mongoose.model('Article', articleSchema);
