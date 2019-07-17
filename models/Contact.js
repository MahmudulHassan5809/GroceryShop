const mongoose = require('mongoose');
const Schema = mongoose.Schema;



//Create Schema
const ContactSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
 name: {
    type: String,
  },
  email: {
    type: String,
  },
  subject: {
    type: String,
  },
  message: {
    type: String,
  },
  date:{
    type: Date,
    default: Date.now
  }
});



module.exports = Contact = mongoose.model('contact',ContactSchema);
