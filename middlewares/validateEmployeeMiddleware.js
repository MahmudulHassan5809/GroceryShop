const { body } = require('express-validator/check');
module.exports = {
	validateEmployeeMiddleware: function (req,res,next) {
		req.checkBody('name','Employee Name is Required').notEmpty();
		req.checkBody('phone','Employee Phone is Required').notEmpty();

		req.checkBody('email','Employee Email is Required').notEmpty();
		const errors = req.validationErrors();

	    if(errors){
	         let messages = [];
	         errors.forEach((error) => {
	             messages.push(error.msg);
	         });

	         req.flash('errors', messages);
	         req.flash('data',req.body);
	         res.redirect('/admin-employee/add-employee');
	    }else{
	         return next();
	    }
	},
	validateEditEmployeeMiddleware: function (req,res,next) {
		req.checkBody('name','Employee Name is Required').notEmpty();
		req.checkBody('phone','Employee Phone is Required').notEmpty();

		req.checkBody('email','Employee Email is Required').notEmpty();
		const errors = req.validationErrors();

	    if(errors){
	         let messages = [];
	         errors.forEach((error) => {
	             messages.push(error.msg);
	         });

	         req.flash('errors', messages);
	         req.flash('data',req.body);
	         res.redirect('/admin-employee/edit-employee/' + req.params.id);
	    }else{
	         return next();
	    }
	},

}
