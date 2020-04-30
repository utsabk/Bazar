const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const chatSchema = new Schema(
  {
    message: { type: String,},
    sender: {type: mongoose.Types.ObjectId, ref:  'User' },
    sendTo:{type: mongoose.Types.ObjectId, ref:  'User' },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Chat', chatSchema);
