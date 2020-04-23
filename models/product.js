const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  Name: String,
  Description: String,
  Price: Number,
  Status:  {type: mongoose.Types.ObjectId, ref:  'ProductStatus' },
  Category:  {type: mongoose.Types.ObjectId, ref:  'Category' },
  Image: String,
  Owner:  {type: mongoose.Types.ObjectId, ref:  'User' },
  Location: {
    type: {
      type: String,
      enum: 'Point',
      require: true,
    },
    coordinates: {
      type: [Number],
      require: true,
    },
  },
});

module.exports = mongoose.model('Product', productSchema);
