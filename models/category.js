const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  Title:String
});

module.exports = mongoose.model('Category',categorySchema)
