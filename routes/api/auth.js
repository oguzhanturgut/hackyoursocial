const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { sendEmail } = require('../../send_mail');
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

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
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
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      if (!user.confirmed)
        return res
          .status(400)
          .json({ errors: [{ msg: 'Please confirm your email to login' }] });

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// password forgot and reset routes**************
// password forgot and reset routes*************
router.put(
  '/forgot-password',
  [check('email', 'Please include a valid email').isEmail()],
  (req, res) => {
    console.log('forget password');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log('forgot password finding user with that email');
    const { email } = req.body;
    console.log('signin req.body', email);

    // find the user in our database based on email
    User.findOne({ email }, (err, user) => {
      // if err or no user
      if (err || !user)
        return res.status('401').json({
          error: 'User with that email does not exist!'
        });

      // generate a token with user id and secret
      const token = jwt.sign({ _id: user._id }, config.get('jwtSecret'));
      // res.json({ user, token });

      // email data
      const resetPwUrl = `${HOST_ADDR}/reset-password/${token}`;
      const emailData = {
        from: process.env.MAIL_USER || config.get('email'),
        to: email,
        subject: 'Password Reset Instructions',
        text: `Please use the following link to reset your password: ${resetPwUrl}`,
        html: `<p>Please use the following link to reset your password:</p> <p>${resetPwUrl}</p>`
      };
      console.log(emailData.text);

      return user.updateOne({ resetPasswordLink: token }, (err, success) => {
        if (err) {
          return res.json({ message: err });
        } else {
          sendEmail(emailData);
          return res.status(200).json({
            message: `Email has been sent to ${email}. Follow the instructions to reset your password.`
          });
        }
      });
    });
  }
);

// ***
router.put(
  '/reset-password',
  [
    check(
      'newPassword',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //  in the frontend we have to use ReactRouterDom to get the resetPasswordLink from the url and push it to the body

    try {
      const { resetPasswordLink, newPassword } = req.body;
      console.log(resetPasswordLink, newPassword);
      let user = await User.findOne({ resetPasswordLink });
      // if  Not the user
      if (!user)
        return res.status('401').json({
          error: 'Invalid Link!'
        });
      // there is a user
      const salt = await bcrypt.genSalt(10);
      const newPasswordCrypt = await bcrypt.hash(newPassword, salt);
      user = await User.findOneAndUpdate(
        { resetPasswordLink },
        { $set: { resetPasswordLink: '', password: newPasswordCrypt } }
      );

      res.json({
        message: `Great! Now you can login with your new password.`
      });
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  }
);

module.exports = router;
