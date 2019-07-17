const { body } = require('express-validator/check');

module.exports = {
	validateProductMiddleware: function (req,res,next) {
		req.checkBody('name','Name is Required').notEmpty();
		req.checkBody('price','Price is Required').notEmpty();
		req.checkBody('sellingPrice','SellingPrice is Required').notEmpty();
		req.checkBody('quantity','Quantity is Required').notEmpty();
		req.checkBody('description','Description is Required').notEmpty();
		req.checkBody('category','Category is Required').notEmpty();
		const errors = req.validationErrors();

	    if(errors){
	         let messages = [];
	         errors.forEach((error) => {
	             messages.push(error.msg);
	         });

	         req.flash('errors', messages);
	         req.flash('data',req.body);
	         res.redirect('/admin-product/add-product');
	    }else{
	         return next();
	    }
	},
	validateEditProductMiddleware: function (req,res,next) {
		req.checkBody('name','Name is Required').notEmpty();
		req.checkBody('price','Price is Required').notEmpty();
		req.checkBody('sellingPrice','SellingPrice is Required').notEmpty();
		req.checkBody('quantity','Quantity is Required').notEmpty();
		req.checkBody('description','Description is Required').notEmpty();
		req.checkBody('category','Category is Required').notEmpty();
		const errors = req.validationErrors();

	    if(errors){
	         let messages = [];
	         errors.forEach((error) => {
	             messages.push(error.msg);
	         });

	         req.flash('errors', messages);
	         req.flash('data',req.body);
	         res.redirect('/admin-product/edit/' + req.params.id);
	    }else{
	         return next();
	    }
	}
}





