const { body } = require('express-validator/check');

module.exports = {
	validateAdminMiddleware: function (req,res,next) {
		req.checkBody('name','Name is Required').notEmpty();
		req.checkBody('role','Role is Required').notEmpty();
		req.checkBody('email','Email is Required').notEmpty();
		req.checkBody('password','Password is Required').notEmpty();

		const errors = req.validationErrors();

	    if(errors){
	         let messages = [];
	         errors.forEach((error) => {
	             messages.push(error.msg);
	         });

	         req.flash('errors', messages);
	         req.flash('data',req.body);
	         res.redirect('/admin/add-admin');
	    }else{
	         return next();
	    }
	},
	validateEditAdminMiddleware: function (req,res,next) {
		req.checkBody('name','Name is Required').notEmpty();
		req.checkBody('role','Role is Required').notEmpty();
		req.checkBody('email','Email is Required').notEmpty();;
		const errors = req.validationErrors();

	    if(errors){
	         let messages = [];
	         errors.forEach((error) => {
	             messages.push(error.msg);
	         });

	         req.flash('errors', messages);
	         req.flash('data',req.body);
	         res.redirect('/admin/edit-admin/' + req.params.id);
	    }else{
	         return next();
	    }
	}
}





