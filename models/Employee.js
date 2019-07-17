const mongoose = require('mongoose');
const Schema = mongoose.Schema;



//Create Schema
const EmployeeSchema = new Schema({
  order:[{
      type: Schema.Types.ObjectId,
      ref: 'order'
  }],
  name: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  date:{
    type: Date,
    default: Date.now
  }
});



module.exports = Employee = mongoose.model('employee',EmployeeSchema);
