const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productStatusSchema = new Schema({
  Title: String,
});

module.exports = mongoose.model('ProductStatus', productStatusSchema);
