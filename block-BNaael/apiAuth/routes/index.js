var express = require('express');
var router = express.Router();
const auth = require('../middlewares/auth');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/dashboard', auth.verifyUser, async (req, res) => {
  try {
    res.send('this is the dashboard page which is protected');
  } catch (error) {
    res.redirect('/');
  }
});

module.exports = router;
