const Admin = require('../models/Admin');

module.exports = {
  ensureAuthenticated: function(req, res, next){
    Admin.findById(req.session.adminId)
        .then(user => {
          if(!user){
            req.flash('loginMessage','You Are Not LoggedIn');
            return res.redirect('/admin/login');
          }else{
            return next();
          }
        })
        .catch(err => console.log(err));
  },
  checkLogin: function(req, res , next){
    Admin.findById(req.session.adminId)
        .then(user => {
          if(user){
            req.flash('loginMessage','You Are Already Logged In')
            return res.redirect('/admin/dashboard');
          }else{
            return next();
          }
        })
        .catch(err => console.log(err));
  },
  checkMainAdmin: function(req, res , next){
     Admin.findOne({_id: req.session.adminId, role: 'main'})
        .then(user => {
          if(!user){
            req.flash('roleMessage','You Dont Have Permission');
            return res.redirect('/admin');
          }else{
            return next();
          }
        })
        .catch(err => console.log(err));
  },
  checkCoAdmin: function(req, res , next){
     Admin.findOne({_id: req.session.adminId, $or: [
          {'role':'main'}, {'role':'coadmin'}
      ]})
        .then(user => {
          if(!user){
            req.flash('roleMessage','You Dont Have Permission');
            return res.redirect('/admin');
          }else{
            return next();
          }
        })
        .catch(err => console.log(err));
  },


}
