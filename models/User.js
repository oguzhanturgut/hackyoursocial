const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  sentRequest: [
    {
      username: {
        type: String,
        default: '',
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
      date: {
        type: Date,
        default: Date.now,
      },
      avatar: {
        type: String,
      },
    },
  ],
  request: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
      username: {
        type: String,
        default: '',
      },
      date: {
        type: Date,
        default: Date.now,
      },
      avatar: {
        type: String,
      },
    },
  ],
  friendsList: [
    {
      friendId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
      friendName: {
        type: String,
        default: '',
      },
      date: {
        type: Date,
        default: Date.now,
      },
      avatar: {
        type: String,
      },
    },
  ],
  totalRequest: {
    type: Number,
    default: 0,
  },
});

module.exports = User = mongoose.model('user', UserSchema);
