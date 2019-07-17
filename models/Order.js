const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Create Schema
const OrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  invoice: {
    type: String
  },
  phone: {
  	type: String
  },
  address: {
    type: String
  },
  email: {
    type: String
  },
  ispaid: {
    type: Boolean,
    default: false
  },
  isdeliver: {
    type: Boolean,
    default: false
  },
  order: [],
  date:{
    type: Date,
    default: Date.now
  }
});




module.exports = Order = mongoose.model('order',OrderSchema);
