const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Create Schema
const ProfitSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'product'
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'order'
  },
  qty:{
    type: String,
  },
  profit: {
     type: String
  },
  date:{
    type: Date,
    default: Date.now
  }
});




module.exports = Profit = mongoose.model('profit',ProfitSchema);
