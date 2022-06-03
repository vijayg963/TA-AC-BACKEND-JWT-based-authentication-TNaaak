var express = require('express');
let router = express.Router();
let Article = require('../models/Article');
let auth = require('../middleware/auth');
let User = require('../models/User');
let Comment = require('../models/Comment');
var formatData = require('../middleware/formatdata');

let { userProfile, userJSON, articleformat } = formatData;

// get user profile by user name
router.get(
  '/:username',
  auth.optionalAuthorization,
  async function (req, res, next) {
    try {
      let id = req.user.id;
      let username = req.param.username;
      let user = await User.findOne({ username: username });
      res.status(200).json({ user: userProfile(user, id) });
    } catch (error) {
      next(error);
    }
  }
);

// middleware for verfiy user can access the below routes
router.use(auth.isVerified);

// follow the user
router.get('/:username/follow', async (req, res, next) => {
  try {
    let id = req.user.id;
    let username = req.params.username;
    let user = await User.findOne({ username: username });
    let updateProfile = await User.findByIdAndUpdate(
      id,
      {
        $push: { followingList: user._id },
      },
      { new: true }
    ).select({ password: 0 });
    // update data of user
    let targatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $push: { followersList: updateProfile._id },
      },
      { new: true }
    ).select({ password: 0 });
    res.status(202).json({
      user: userProfile(updateProfile, id),
      targatedUser: userProfile(targatedUser, id),
    });
  } catch (error) {
    next(error);
  }
});

// unfollow the user
router.delete('/:username/follow', async (req, res, next) => {
  try {
    let id = req.user.id;
    let username = req.params.username;
    let user = await User.findOne({ username: username });
    let updateProfile = await User.findByIdAndUpdate(
      id,
      {
        $pull: { followingList: user._id },
      },
      { new: true }
    );

    // update targated user data
    let targatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $pull: { followersList: updateProfile._id },
      },
      { new: true }
    );
    res.status(202).json({
      user: userProfile(updateProfile, id),
      targatedUser: userProfile(targatedUser, id),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
