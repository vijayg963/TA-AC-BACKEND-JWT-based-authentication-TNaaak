var express = require('express');
let router = express.Router();
let Article = require('../models/Article');
let auth = require('../middleware/auth');
// let User = require('../models/User');
// let Comment = require('../models/Comment');

// get tag list
router.get('/', auth.optionalAuthorization, async (req, res) => {
  try {
    let alltags = await Article.find({}).distinct('taglist');
    res.status(200).json({ tags: alltags });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
