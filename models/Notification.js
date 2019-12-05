const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  text: {
    type: String,
  },
  status: {
    type: Boolean,
    default: false,
  },
  linkTo: {
    type: String,
  },
  userBy: {
    type: String,
  },
  userTo: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  postTo: {
    type: Schema.Types.ObjectId,
    ref: 'posts',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Notification = mongoose.model('notification', NotificationSchema);
