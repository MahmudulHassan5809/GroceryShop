const { body } = require('express-validator/check');
module.exports = {

	roleValidator: function(req, res, next){
    req.checkBody('name','Role Title is Required').notEmpty();

	const errors = req.validationErrors();
    if(errors){
         let messages = [];
         errors.forEach((error) => {
             messages.push(error.msg);
         });

         req.flash('errors', messages);
         req.flash('data',req.body);
         res.redirect('/admin-role/add-role');
    }else{
         return next();
    }
  },
  roleEditValidator: function(req, res, next){
    req.checkBody('name','Role Title is Required').notEmpty();

    const errors = req.validationErrors();
    if(errors){
         let messages = [];
         errors.forEach((error) => {
             messages.push(error.msg);
         });

         req.flash('errors', messages);
         req.flash('data',req.body);
         res.redirect('/admin-role/edit/' + req.params.id);
    }else{
         return next();
    }
  }

}
