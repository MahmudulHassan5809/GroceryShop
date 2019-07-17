const express = require('express');
const router = express.Router();

const { ensureAuthenticated,checkLogin,checkMainAdmin,checkCoAdmin } = require('../../middlewares/admin');

const { categoryValidator,categoryEditValidator } = require('../../middlewares/validator');

const Category = require('../../models/Category');

router.get('/categories',ensureAuthenticated,checkCoAdmin,(req,res) => {
	Category.find({})
		.then(categories => {
			res.render('admin/categories/categories',{
				title: 'Categories',
				categories: categories,
				message: req.flash('success'),
			})
		})
		.catch(err => console.log(err));

});

router.get('/add-category',ensureAuthenticated,checkMainAdmin,(req,res) => {
	res.render('admin/categories/add-category',{
		title: 'Add Category',
		validation_errors: req.flash('errors'),
		error_message: req.flash('error'),
		message: req.flash('success'),
		data: req.flash('data')[0]
	})

});

router.post('/add-category',ensureAuthenticated,checkMainAdmin,categoryValidator,(req,res) => {

	const category = new Category();
	category.name = req.body.name;

	category.save()
		.then(category => {
			req.flash('success','SuccessFuly Add a Category');
			return res.redirect('/admin-category/categories');
		})
		.catch(err => {
			let = validationErrors = []
			if (err.name === 'MongoError' && err.code === 11000){
				validationErrors.push('Please Select An Unique Title')
			}

	        req.flash('errors',validationErrors);
	        req.flash('data',req.body);
			console.log(err.name)
	        return res.redirect('/admin-category/add-category');
		});
});


router.get('/edit/:id',ensureAuthenticated,checkMainAdmin,(req,res) => {
	Category.findOne({
   		_id: req.params.id
   	})
   	.then(category => {
		res.render('admin/categories/edit-category',{
			title: category.name,
	        category: category,
	        validation_errors: req.flash('errors'),
			error_message: req.flash('error'),
			message: req.flash('success'),
			data: req.flash('data')[0]
	    });
   	})
   	.catch(err => console.log(err));
});

router.put('/edit/:id',ensureAuthenticated,checkMainAdmin,categoryEditValidator,(req,res) => {
	Category.findOne({
   		_id: req.params.id
   })
   .then(category => {
	   	category.name = req.body.name,
	   	category.save()
	   	.then(category => {
	   		req.flash('success','Category Updated Successfully..');
	   		res.redirect('/admin-category/edit/' + req.params.id);
	   	});
   })
   .catch(err => console.log(err));
});


router.delete('/delete/:id',ensureAuthenticated,checkMainAdmin,(req , res) => {
   Category.deleteOne({_id: req.params.id})
    .then(() => {
    	req.flash('success','Category Deleted Successfully..');
    	res.redirect('/admin-category/categories');
    })
});



module.exports = router;
