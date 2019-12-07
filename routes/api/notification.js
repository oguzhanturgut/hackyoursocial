const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Notification = require('../../models/Notification');

// @route    GET api/notification
// @desc     Get notification by user ID
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ userTo: req.user.id }).sort({
      status: 1,
      date: -1,
    });

    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/notification/:id
// @desc     Delete a notification by user Id
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    // Check for ObjectId format and post
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/) || !notification) {
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

// @route    PUT api/notification/:id
// @desc     Update a notification status by user Id
// @access   Private
router.put('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    // Check for ObjectId format and post
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/) || !notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }

    // Check user
    if (notification.userTo.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await notification.update({ _id: req.params.id }, { $set: { status: true } }, function(
      err,
      result,
    ) {
      err ? console.log(err.message) : console.log(result);
    });

    res.json(notification);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

module.exports = router;
