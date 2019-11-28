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
  confirmed: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
  resetPasswordLink: { data: String, default: '' },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model('user', UserSchema);
