const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  Name: String,
  Email: String,
  Password: String,
  Phone: String,
  DP: String,
  Products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
});

module.exports = mongoose.model('User', userSchema);
