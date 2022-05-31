const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bookId: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
});

// Hash the password
userSchema.pre('save', async function (req, res, next) {
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    res.status(500).jsson(error);
  }
});

// get token
userSchema.methods.signToken = async function () {
  try {
    let token = jwt.sign(
      { user: this.id, email: this.email },
      'thisisthesecret'
    );
    return token;
  } catch (error) {
    return 'token not genrated', error;
  }
};

userSchema.methods.userJSON = function (token) {
  return {
    userId: this.userId,
    email: this.email,
    token: token,
  };
};

module.exports = mongoose.model('User', userSchema);
