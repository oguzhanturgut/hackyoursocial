const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', [
      'name',
      'avatar',
    ]);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skills is required')
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    // Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      // Using upsert option (creates new doc if no match is found):
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true },
      );
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
);

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) return res.status(400).json({ msg: 'Profile not found' });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/', auth, async (req, res) => {
  try {
    // Remove user posts
    await Post.deleteMany({ user: req.user.id });
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required')
        .not()
        .isEmpty(),
      check('company', 'Company is required')
        .not()
        .isEmpty(),
      check('from', 'From date is required')
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, location, from, to, current, description } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
);

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private
// router.delete('/experience/:exp_id', auth, async (req, res) => {
//   try {
//     const profile = await Profile.findOne({ user: req.user.id });

//     // Get remove index
//     const removeIndex = profile.experience
//       .map(item => item.id)
//       .indexOf(req.params.exp_id);

//     profile.experience.splice(removeIndex, 1);

//     await profile.save();

//     res.json(profile);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });
    const expIds = foundProfile.experience.map(exp => exp._id.toString());
    // if i dont add .toString() it returns this weird mongoose coreArray and the ids are somehow objects and it still deletes anyway even if you put /experience/5
    const removeIndex = expIds.indexOf(req.params.exp_id);
    if (removeIndex === -1) {
      return res.status(500).json({ msg: 'Server error' });
    } else {
      // theses console logs helped me figure it out
      console.log('expIds', expIds);
      console.log('typeof expIds', typeof expIds);
      console.log('req.params', req.params);
      console.log('removed', expIds.indexOf(req.params.exp_id));
      foundProfile.experience.splice(removeIndex, 1);
      await foundProfile.save();
      return res.status(200).json(foundProfile);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required')
        .not()
        .isEmpty(),
      check('degree', 'Degree is required')
        .not()
        .isEmpty(),
      check('fieldofstudy', 'Field of study is required')
        .not()
        .isEmpty(),
      check('from', 'From date is required')
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { school, degree, fieldofstudy, from, to, current, description } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
);

// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private
//router.delete('/education/:edu_id', auth, async (req, res) => {
//try {
//const profile = await Profile.findOne({ user: req.user.id });

// Get remove index
//const removeIndex = profile.education
//.map(item => item.id)
//.indexOf(req.params.edu_id);
/*
    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
*/

router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });
    const eduIds = foundProfile.education.map(edu => edu._id.toString());
    // if i dont add .toString() it returns this weird mongoose coreArray and the ids are somehow objects and it still deletes anyway even if you put /education/5
    const removeIndex = eduIds.indexOf(req.params.edu_id);
    if (removeIndex === -1) {
      return res.status(500).json({ msg: 'Server error' });
    } else {
      // theses console logs helped me figure it out
      /*   console.log("eduIds", eduIds);
      console.log("typeof eduIds", typeof eduIds);
      console.log("req.params", req.params);
      console.log("removed", eduIds.indexOf(req.params.edu_id));
 */ foundProfile.education.splice(
        removeIndex,
        1,
      );
      await foundProfile.save();
      return res.status(200).json(foundProfile);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
});
// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: encodeURI(
        `https://api.github.com/users/${
          req.params.username
        }/repos?per_page=5&sort=created:asc&client_id=${config.get(
          'githubClientId',
        )}&client_secret=${config.get('githubSecret')}`,
      ),
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No Github profile found' });
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/// Friend Requests

// Sender >>> Receiver

// @route    POST api/profile/friend/:id(receiver user id)
// @desc     Send a friend request to a user
// @access   Private

router.post('/friend/:id', auth, async (req, res) => {
  try {
    const receiver = await User.findById(req.params.id).select('-password');
    const sender = await User.findById(req.user.id).select('-password');

    // Check receiver database whether the sender has sent friend request to receiver or not
    const isRequested = receiver.request.find(reques => reques.userId.toString() === req.user.id);
    // Check receiver database whether the sender is already friend or not
    const isFriend = receiver.friendsList.find(
      friend => friend.friendId.toString() === req.user.id,
    );
    // Check sender database whether the sender has sent friend request to receiver or not
    const isSentRequest = sender.sentRequest.find(
      reques => reques.userId.toString() === req.params.id,
    );

    if (!isRequested && !isSentRequest && !isFriend) {
      // Add to sentRequest array in the sender database
      sender.sentRequest.push({
        userId: req.params.id,
        username: receiver.name,
      });

      await sender.save();
      // Add to request array in the receiver database
      receiver.request.push({
        userId: req.user.id,
        username: sender.name,
      });
      // Increment total request in the receiver database
      receiver.totalRequest += 1;

      await receiver.save();
      return res.json({ msg: `Your friend request is successfully sent to ${receiver.name}` }); // @Todo
    }

    return res.status(404).json({ msg: 'Not found' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Receiver >>> Sender
// @route    PUT api/profile/friend/:senderId
// @desc     Accept a friend request
// @access   Private

router.put('/friend/:senderId', auth, async (req, res) => {
  try {
    const receiver = await User.findById(req.user.id).select('-password');

    const sender = await User.findById(req.params.senderId).select('-password');

    const isFriend = receiver.friendsList.find(
      friend => friend.friendId.toString() === req.params.senderId,
    );
    const isFriendListOnSender = sender.friendsList.find(
      friend => friend.friendId.toString() === req.user.id,
    );

    // Receiver must own request from sender in his database
    const isRequested = receiver.request.find(
      reques => reques.userId.toString() === req.params.senderId,
    );
    //receiver in friendListinde senderin userIdsi yoksa, bi zahmet ekle
    // senderin friendListinde receiverin yoksa senderin friendListine ekle
    if (!isFriend && !isFriendListOnSender && isRequested) {
      // Add to Sender info to friendList array in the receiver database
      receiver.friendsList.push({
        friendId: req.params.senderId,
        friendName: sender.name,
      });
      // Remove sender info from Receiver request database because they are going to be friend
      const getSenderId = receiver.request
        .map(reques => reques.userId.toString())
        .indexOf(req.params.senderId);
      receiver.request.splice(getSenderId, 1);

      receiver.totalRequest -= 1;
      await receiver.save();
      // Add to Receiver info to friendList array in the sender database
      sender.friendsList.push({
        friendId: req.user.id,
        friendName: receiver.name,
      });
      // Remove Receiver info from Sender senrRequest database because they are going to be friend
      const getReceiverId = sender.sentRequest
        .map(reques => reques.userId.toString())
        .indexOf(req.user.id);

      sender.sentRequest.splice(getReceiverId, 1);

      await sender.save();
      return res.json({ msg: `You have accepted ${sender.name} as a friend` }); // @Todo
    }

    return res.status(500).json({ msg: 'Server error' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Receiver >>> Sender
// @route    PATCH api/profile/friend/:senderId
// @desc     Cancel friend request
// @access   Private

router.patch('/friend/:senderId', auth, async (req, res) => {
  try {
    const receiver = await User.findById(req.user.id).select('-password');
    const sender = await User.findById(req.params.senderId).select('-password');

    // Receiver must own request from sender in his database
    const isRequested = receiver.request.find(
      reques => reques.userId.toString() === req.params.senderId,
    );

    // Sender must own receiver in his sentRequest database
    const isSentRequest = sender.sentRequest.find(
      reques => reques.userId.toString() === req.user.id,
    );

    if (isRequested && isSentRequest) {
      // Remove sender request from receiver request database
      const getSenderId = receiver.request
        .map(reques => reques.userId.toString())
        .indexOf(req.params.senderId);
      receiver.request.splice(getSenderId, 1);
      // Decrement total request of receiver
      receiver.totalRequest -= 1;
      await receiver.save();

      // Remove sender request from sender sentRequest database

      const getReceiverId = sender.sentRequest
        .map(reques => reques.userId.toString())
        .indexOf(req.user.id);

      sender.sentRequest.splice(getReceiverId, 1);
      await sender.save();
      return res.json({ msg: `You have rejected ${sender.name} friend request` }); // @Todo
    }
    return res.status(500).json({ msg: 'Server error' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Receiver >>> Sender
// @route    DELETE api/profile/friend/:senderId
// @desc     Break up the friendship
// @access   Private

router.delete('/friend/:senderId', auth, async (req, res) => {
  try {
    const receiver = await User.findById(req.user.id).select('-password');

    const sender = await User.findById(req.params.senderId).select('-password');

    // Check they are friends of each other

    const isFriend = receiver.friendsList.find(
      friend => friend.friendId.toString() === req.params.senderId,
    );
    const isFriendListOnSender = sender.friendsList.find(
      friend => friend.friendId.toString() === req.user.id,
    );

    if (isFriend && isFriendListOnSender) {
      // remove Sender Info from receiver friendList database. They are not friend right now
      const getSenderId = receiver.friendsList
        .map(friend => friend.friendId.toString())
        .indexOf(req.params.senderId);

      receiver.friendsList.splice(getSenderId, 1);
      await receiver.save();

      // remove receiver Info from sender friendList database. They are not friend right now
      const getReceiverId = sender.friendsList
        .map(friend => friend.friendId.toString())
        .indexOf(req.user.id);

      sender.friendsList.splice(getReceiverId, 1);

      await sender.save();
      return res.json({ msg: `You are not a friend with ${sender.name} ` }); // @Todo
    }

    return res.status(500).json({ msg: 'Server error' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
