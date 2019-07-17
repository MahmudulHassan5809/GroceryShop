const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const crypto = require('crypto');
const bcrypt = require('bcrypt');

//Create Schema
const AdminSchema = new Schema({
  email:{
    type: String,
    required: true,
    unique: true
  },
  name:{
    type: String,
    required: true
  },
  role:{
    type: String,
    default: ''
  },
  isAdmin:{
    type: Boolean,
    default: true
  },
  password:{
    type: String,
  },
  passwordResetToken:{
      type:String,
      default: ''
  },
  passwordResetExpries:{
      type:Date,
      default: Date.now
  },
  date:{
    type: Date,
    default: Date.now
  }
});


AdminSchema.pre('save', function(next) {
  const user = this;
  bcrypt.hash(user.password,10,function(error,encrypted){
    user.password = encrypted;
    next();
  });

});


module.exports = Admin = mongoose.model('admin',AdminSchema);
