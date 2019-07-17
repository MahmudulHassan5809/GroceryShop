const mongoose = require('mongoose');
const Schema = mongoose.Schema;



//Create Schema
const FaqSchema = new Schema({
  question: {
    type: String,
  },
  answer: {
    type: String,
  },
  date:{
    type: Date,
    default: Date.now
  }
});



module.exports = Faq = mongoose.model('faq',FaqSchema);
