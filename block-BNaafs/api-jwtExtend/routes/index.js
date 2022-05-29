var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/dashboard', (req, res) => {
  res.send({ access: 'protected resource' });
});

module.exports = router;
