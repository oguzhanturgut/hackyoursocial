const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const sendMail = require('../../utils/sendMail');
const { check, validationResult } = require('express-validator/check');

const HOST_ADDR = process.env.HOST_ADDR || config.get('local_url');

const User = require('../../models/User');

// @route    GET api/auth
// @desc     Test route
// @access   Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/auth/facebook
// @desc     Load user
// @access   Public
router.get('/facebook', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/auth/google
// @desc     Load user
// @access   Public
router.get('/google', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      if (!user.confirmed)
        return res.status(400).json({ errors: [{ msg: 'Please confirm your email to login' }] });

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },
);

// @route    PUT api/auth/forgot-password
// @desc     Send Password Recovery Email
// @access   Public
router.put(
  '/forgot-password',
  [check('email', 'Please include a valid email').isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email } = req.body;
    try {
      const user = await User.findOne({ email });

      // To hide if the user is registered or not. (Social engineering attack)
      if (!user)
        return res.json({
          msg: `Email has been sent to ${email}. Follow the instructions to reset your password.`,
        });

      const token = jwt.sign({ _id: user._id }, config.get('jwtSecret'));

      const resetPwUrl = `${HOST_ADDR}/reset-password/${token}`;

      const msg = {
        from: process.env.MAIL_USER || config.get('email'),
        to: email,
        subject: 'Account Password Reset',
        text: `Please use the following link to reset your password: ${resetPwUrl}`,
        html: `<h3>Hello ${user.name}</h3><p>You requested a password reset link for your Hack Your Social account and here it is. Resetting your password is as easy as clicking the link and following the instructions!</p> <p>${resetPwUrl}</p>`,
      };

      await user.updateOne({ resetPasswordLink: token });
      await sendMail(msg);
      res.json({
        msg: `Email has been sent to ${email}. Follow the instructions to reset your password.`,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },
);

// @route    PUT api/auth/reset-password
// @desc     Reset Password When The User Click The received Link
// @access   Public
router.put(
  '/reset-password',
  [check('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { resetPasswordLink, newPassword } = req.body;

      const user = await User.findOne({ resetPasswordLink });

      if (!user)
        return res.status(401).json({
          error: 'Invalid Link!',
        });

      const salt = await bcrypt.genSalt(10);
      const newPasswordCrypt = await bcrypt.hash(newPassword, salt);
      await User.findOneAndUpdate(
        { resetPasswordLink },
        { $set: { resetPasswordLink: '', password: newPasswordCrypt } },
      );

      res.json({
        msg: `Great! Now you can login with your new password.`,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },
);

module.exports = router;
