const express = require('express');
const Post = require('../../models/Post');
const router = express.Router();
const auth = require('../../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    // Get posts from database
    const posts = await Post.find().sort({ date: -1 });
    // get latest three posts
    // const newsFeed = posts.slice(0, 5);
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
