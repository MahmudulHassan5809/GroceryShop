const mongoose = require('mongoose');
const Schema = mongoose.Schema;



//Create Schema
const RoleSchema = new Schema({
  name:{
    type: String,
    unique:   true,
    required: [true,'Please Provide A Category Name']
   },
  date:{
    type: Date,
    default: Date.now
  }
});



module.exports = Role = mongoose.model('role',RoleSchema);
