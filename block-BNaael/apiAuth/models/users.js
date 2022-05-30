var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre('save', async (req, res, next) => {
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    res.status(500).json(e);
  }
});

userSchema.methods.signToken = async function () {
  try {
    let token = jwt.sign(
      { user: this.id, email: this.email },
      'thisisthesecret'
    );
    return token;
  } catch (error) {
    return 'token is not genrated';
  }
};

userSchema.methods.userJSON = function () {
  return {
    userId: this.userId,
    email: this.email,
    token: token,
  };
};

module.exports = mongoose.model('User', userSchema);
