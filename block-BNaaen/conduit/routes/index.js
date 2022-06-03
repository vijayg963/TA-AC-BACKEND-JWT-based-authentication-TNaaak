var express = require('express');
var router = express.Router();
var auth = require('../middleware/auth');
// var User = require('../models/User');
// var Article = require('../models/Article');

/* GET home page. */
router.get('/', auth.isVerified, function (req, res, next) {
  res.json({ massage: 'this is protected route' });
});

module.exports = router;
