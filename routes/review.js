const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const router = express.Router();


const { ensureAuthenticated,checkLogin } = require('../middlewares/auth');


const Product = require('../models/Product');
const User = require('../models/User');

router.get('/product/:id',ensureAuthenticated,(req,res) => {
	Product.findOne({_id:req.params.id})
		.then(product => {
			res.render('product/review',{
				title: `${product.name}-Review`,
				//message: req.flash('success'),
				product: product
			})
		})
		.catch(err => console.log(err));
});

router.post('/product/:id',ensureAuthenticated,(req,res) => {
	Product.findOne({_id:req.params.id})
		.then(product => {
			console.log(req.body.clickedValue)
			Product.findOneAndUpdate({_id:req.params.id},
				{
                    $push: {productRatings: {
                        userName: req.user.name,
                        userImage: req.user.photo,
                        userRating: req.body.clickedValue,
                        userReview: req.body.review
                    },
                        ratingNumber: req.body.clickedValue
                    },
                    $inc: {ratingSum: req.body.clickedValue}
                }
			)
			.then(updatedProduct => {
				req.flash('success','Your Review Has Been Added');
				res.redirect('/product/' + updatedProduct.slug)
			})
			.catch(err => console.log(err));
		})
		.catch(err => console.log(err));
})


module.exports = router;
