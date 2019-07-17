const mongoose = require('mongoose');
const Schema = mongoose.Schema;



//Create Schema
const ShopInfoSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  sologan:{
    type: String,
    required: true
  },
  address:{
    type: String,
    required: true
  },
  email:{
    type: String,
  },
  phone:{
    type: String,
    required: true
  },
  about:{
    type: String,
    required: true
  },
  fax:{
    type: String,
    required: true
  },
  social: [{
    facebook: {type: String, default: ''},
    twitter: {type: String, default: ''},
    google: {type: String, default: ''},
    linkedin: {type: String, default: ''},
    instagram: {type: String, default: ''},
  }],
  date:{
    type: Date,
    default: Date.now
  }
});



module.exports = ShopInfo = mongoose.model('shopinfo',ShopInfoSchema);
