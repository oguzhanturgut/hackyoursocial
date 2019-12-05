const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const User = require('../../models/User');
const Notification = require('../../models/Notification');

// @route    GET api/notification
// @desc     Get all notification
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ date: -1 });
    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/notification/:id
// @desc     Get notification by user ID
// @access   Private
router.get('/:id', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ userTo: req.params.id });

    // Check user
    if (req.params.id !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/notification/:id/notification:id
// @desc     Delete a notification by user Id
// @access   Private
router.delete('/:id/:notification_id', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.notification_id);

    // Check for ObjectId format and post
    if (!req.params.notification_id.match(/^[0-9a-fA-F]{24}$/) || !notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }

    // Check user
    if (notification.userTo.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await notification.remove();

    res.json({ msg: 'Notification removed' });
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route    PUT api/notification/:id/notification:id
// @desc     Update a notification status by user Id
// @access   Private
router.put('/:id/:notification_id', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.notification_id);

    // Check for ObjectId format and post
    if (!req.params.notification_id.match(/^[0-9a-fA-F]{24}$/) || !notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }

    // Check user
    if (notification.userTo.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await notification.update({ _id: req.params.notification_id }, { status: true });

    res.json(notification);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route   POST api/notification
// @desc    Register notification
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newNotification = new Notification({
        text: req.body.text,
        status: false,
        linkTo: user.avatar,
        userBy: user.id,
        userTo: post.user,
        postTo: post.id,
      });

      const notification = await newNotification.save();

      res.json(notification);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
);

module.exports = router;
