const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');
const nodemailer = require('nodemailer');

const HOST_ADDR = process.env.HOST_ADDR || '<deployment host goes here>';

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

      const transporter = nodemailer.createTransport({
        host: 'smtp-pulse.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });

      const emailToken = jwt.sign(payload, config.get('emailSecret'), { expiresIn: '1d' });
      const confirmURL = `${HOST_ADDR}/confirm/${emailToken}`;

      const msg = {
        to: user.email,
        from: process.env.MAIL_USER,
        subject: 'Confirm Email',
        html: `Hurrah! You've created a Developer Hub account with ${user.email}. Please take a moment to confirm that we can use this address to send you mails. <br/>
        <a href=${confirmURL}>${confirmURL}</a>`,
      };

      const result = await transporter.sendMail(msg);
      // console.log(result);
      res.json({ msg: 'Confirmation mail sent' });

      // jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
      //   if (err) throw err;
      //   res.json({ token });
      // });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },
);

module.exports = router;
