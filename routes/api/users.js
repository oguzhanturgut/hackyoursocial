const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');
const sendMail = require('../../utils/sendMail');

const HOST_ADDR = process.env.HOST_ADDR || config.get('local_url');

const User = require('../../models/User');

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      const avatar = gravatar.url(email, {
        protocol: 'https',
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      const emailToken = jwt.sign(payload, config.get('emailSecret'), {
        expiresIn: '1d',
      });
      const confirmURL = `${HOST_ADDR}/confirm/${emailToken}`;

      const msg = {
        to: user.email,
        from: process.env.MAIL_USER || config.get('email'),
        subject: 'Confirm your email address',
        text: `Hurrah! You've created a Hack Your Social account with ${user.email}.
        Please take a moment to confirm that we can use this address to send you mails.: ${confirmURL}`,
        html: `<h3>Hello ${user.name}</h3><p>Hurrah! You've created a Hack Your Social account with ${user.email}.</p> <p>There’s just one step left to use your account.Please take a moment to confirm that we can use this address to send you mails.</p>
        <p><a href='${confirmURL}'>Click here to confirm your email address.</a></p>`,
      };

      await sendMail(msg);
      res.json({ msg: 'Confirmation mail sent' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },
);

// @route   PUT /api/users/confirm/:emailToken
// @desc    Confirm user email
// @access  Public
router.put('/confirm/:emailToken', async (req, res) => {
  const { emailToken } = req.params;
  try {
    const {
      user: { id },
    } = jwt.verify(emailToken, config.get('emailSecret'));
    const user = await User.findOne({ _id: id });
    let msg = '';
    if (user.confirmed) {
      msg = 'Email is already confirmed';
    }
    await User.findOneAndUpdate({ _id: id }, { $set: { confirmed: true } }, { new: true });
    const payload = {
      user: {
        id,
      },
    };

    jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token, msg });
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).send({ errors: [{ msg: 'Email validation link expired' }] });
    } else {
      return res.status(401).send({ errors: [{ msg: 'Invalid Token' }] });
    }
  }
});

// @route   POST   /api/users/resend
// @desc    Resend confirmation email
// @access  Public
router.post(
  '/resend',
  [check('email', 'Please include a valid email').isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          errors: [{ msg: `No user found registered with ${email}` }],
        });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      const emailToken = jwt.sign(payload, config.get('emailSecret'), {
        expiresIn: '1d',
      });
      const confirmURL = `${HOST_ADDR}/confirm/${emailToken}`;

      const msg = {
        to: user.email,
        from: process.env.MAIL_USER || config.get('email'),
        subject: 'Confirm your email address',
        text: `Hurrah! You've created a Hack Your Social account with ${user.email}.
        Please take a moment to confirm that we can use this address to send you mails.: ${confirmURL}`,
        html: `<h3>Hello ${user.name}</h3><p>Hurrah! You've created a Hack Your Social account with ${user.email}.</p> <p>There’s just one step left to use your account.Please take a moment to confirm that we can use this address to send you mails.</p>
        <p><a href='${confirmURL}'>Click here to confirm your email address.</a></p>`,
      };

      await sendMail(msg);
      res.json({ msg: 'Confirmation mail sent' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },
);

// @route    POST api/users/facebook
// @desc     Register user
// @access   Public
router.post('/facebook', async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, avatar, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        return res.json({ token });
      });
    } else {
      user = new User({
        name,
        email,
        avatar,
        password,
      });
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @route    POST api/users/google
// @desc     Register user
// @access   Public
router.post('/google', async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, avatar, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        return res.json({ token });
      });
    } else {
      user = new User({
        name,
        email,
        avatar,
        password,
      });
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        return res.json({ token });
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
