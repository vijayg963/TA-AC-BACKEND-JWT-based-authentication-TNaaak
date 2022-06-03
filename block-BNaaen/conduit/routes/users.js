var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var User = require('../models/User');

/* GET users  */
router.get('/', function (req, res, next) {
  res.json({ user: 'respond with a resource' });
});

// registration
router.post('/', async (req, res, next) => {
  try {
    let user = await User.create(req.body);
    let token = user.signToken();
    res.status(201).json({ user: user.userJSON(token) });
  } catch (error) {
    next(error);
  }
});

// login
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email/password id required' });
    }
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ error: 'email not register' });
    }
    let isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(400).json({ error: 'password invalid' });
    }
    let token = user.signToken();
    res.status(202).json({ user: user.userJSON(token) });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
