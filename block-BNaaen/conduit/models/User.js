const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var auth = require('../middleware/auth');
require('dotenv').config();

const userSchema = new Schema(
  {
    name: { type: String },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String },
    avatar: { type: String },
    followingList: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followersList: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    myarticles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
    favouriteArticle: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
  },
  { timestamps: true }
);

// Hash the password
userSchema.pre('save', async function (req, res, next) {
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    res.status(500).json(error);
  }
});

// get token
userSchema.methods.signToken = async function () {
  try {
    let token = jwt.sign(
      { user: this.id, email: this.email },
      process.env.SECRET
    );
    return token;
  } catch (error) {
    return 'token not genrated', error;
  }
};

// userSchema.methods.userJSON = function (token) {
//   return {
//     userId: this.userId,
//     email: this.email,
//     token: token,
//   };
// };

module.exports = mongoose.model('User', userSchema);
