var express = require('express');
var router = express.Router();
var User = require('../models/users');
var bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.create(req.body);
    console.log(user);
    const token = await user.signToken();
    res.redirect('/');
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'email and password require' });
  }
  try {
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ error: 'email mot registered' });
    }
    let isMatched = await bcrypt.compare(req.body.password, user.password);
    if (!isMatched) {
      return res.status(400).json({ error: 'password not match' });
    }
    let token = await user.signToken();
    return res.send(token);
  } catch (error) {
    res.status(500).json(e);
  }
});

module.exports = router;
