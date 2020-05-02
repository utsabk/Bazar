const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  dp: String,
  products: [ {type: mongoose.Types.ObjectId, ref: 'Product' }],
  
});

module.exports = mongoose.model('User', userSchema);
