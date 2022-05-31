var express = require('express');
var router = express.Router();
var User = require('../models/User');
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.json({ message: 'respond with a resource' });
});

// registeration
router.post('/register', async (req, res) => {
  try {
    console.log(req.body, 'registeration data');
    let user = await User.create(req.body);
    res.status(201).json({ user: user });
  } catch (err) {
    res.status(500).json(err);
  }
});

// login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'email/password required' });
  }
  try {
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ error: ' this email  not registered' });
    }
    let isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: `Password didn't match` });
    }
    let token = await user.signToken();
    return res.send(token);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
