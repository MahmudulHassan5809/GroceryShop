const { body } = require('express-validator/check');

module.exports = {
	validateShopInfoMiddleware: function (req,res,next) {
		req.checkBody('name','Shop Name is Required').notEmpty();
		req.checkBody('sologan','Shop Sologan is Required').notEmpty();
		req.checkBody('address','Shop Address is Required').notEmpty();
		req.checkBody('email','Shop Email is Required').notEmpty();
		req.checkBody('phone','Shop Phone is Required').notEmpty();
		req.checkBody('fax','Shop Fax is Required').notEmpty();
		req.checkBody('about','About Fax is Required').notEmpty();
		const errors = req.validationErrors();

	    if(errors){
	         let messages = [];
	         errors.forEach((error) => {
	             messages.push(error.msg);
	         });

	         req.flash('errors', messages);
	         req.flash('data',req.body);
	         res.redirect('/admin-shopinfo/addinfo');
	    }else{
	         return next();
	    }
	},
	validateEditShopInfoMiddleware: function (req,res,next) {
		req.checkBody('name','Shop Name is Required').notEmpty();
		req.checkBody('sologan','Shop Sologan is Required').notEmpty();
		req.checkBody('address','Shop Address is Required').notEmpty();
		req.checkBody('email','Shop Email is Required').notEmpty();
		req.checkBody('phone','Shop Phone is Required').notEmpty();
		req.checkBody('fax','Shop Fax is Required').notEmpty();
		req.checkBody('about','About Fax is Required').notEmpty();
		const errors = req.validationErrors();

	    if(errors){
	         let messages = [];
	         errors.forEach((error) => {
	             messages.push(error.msg);
	         });

	         req.flash('errors', messages);
	         req.flash('data',req.body);
	         res.redirect('/admin-shopinfo/edit/' + req.params.id);
	    }else{
	         return next();
	    }
	},

}





