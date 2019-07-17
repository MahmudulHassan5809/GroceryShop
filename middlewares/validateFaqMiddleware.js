const { body } = require('express-validator/check');

module.exports = {
	validateFaqMiddleware: function (req,res,next) {
		req.checkBody('question','Question is Required').notEmpty();
		req.checkBody('answer','Answer is Required').notEmpty();

		const errors = req.validationErrors();

	    if(errors){
	         let messages = [];
	         errors.forEach((error) => {
	             messages.push(error.msg);
	         });

	         req.flash('errors', messages);
	         req.flash('data',req.body);
	         res.redirect('/admin-faq/add-faq');
	    }else{
	         return next();
	    }
	},

}





