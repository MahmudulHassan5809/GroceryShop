const mongoose = require('mongoose');
const Schema = mongoose.Schema;



//Create Schema
const WishListSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'product'
  },
  date:{
    type: Date,
    default: Date.now
  }
});



module.exports = WishList = mongoose.model('wishlist',WishListSchema);
