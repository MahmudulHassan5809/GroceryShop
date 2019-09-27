const express = require('express');
const router = express.Router();
const { arrayAverage } = require('../myFunction');
const random = require('mongoose-simple-random');


const { ensureAuthenticated,checkLogin } = require('../middlewares/auth');

const Product = require('../models/Product');
const Faq = require('../models/Faq');

router.get('/',(req,res) => {
	const perPage = 8;
	const currentPage = req.query.page || 1;
	Product.find({
		quantity: { $gt: 0},
	})
	.skip((perPage * currentPage) - perPage)
  	.limit(perPage)
	.populate('category')
	.then(products => {
		Product.find({quantity: { $gt: 0} })
			.then(countProducts => {
				res.render('main/home',{
					title: 'শাম্মি গ্রোসারি শপ',
					products: products,
					message: req.flash('success'),
					currentPage: parseInt(currentPage),
					pages: Math.ceil(countProducts.length/perPage)
				})
			})
			.catch(err => console.log(err));
	})
	.catch(err => console.log(err));
});


router.get('/about',(req,res) => {
	res.render('main/about',{
		title: 'About',
	})
});

router.get('/product/:slug',(req,res) => {
	console.log(1);
	Product.findOne({slug:req.params.slug})
		.populate('category')
		.then(product => {
			Product.findRandom({category:product.category},{},{limit: 3},function(err, similarProducts){
					if(!err){
						const avg = arrayAverage(product.ratingNumber)
						res.render('main/product',{
							message: req.flash('success'),
							title: product.name,
							product : product,
							similarProducts: similarProducts,
							avg: avg
						})
					}
				});
		})
		.catch(err => console.log(err));
});


router.get('/products/:id',(req,res) => {
	Category.findById({_id:req.params.id})
		.then(category => {
			Product.find({
				quantity: { $gt: 0},
				category: req.params.id
			})
			.populate('category')
			.then(products => {
				res.render('main/home',{
					title: category.name,
					products: products,
					message: req.flash('success')
				})
			})
			.catch(err => console.log(err));
		})
		.catch(err => console.log(err));
});


router.get('/faq',(req,res) => {
	Faq.find({})
		.then(faqs => {
			res.render('main/faqs',{
				title: 'Frequenty Asked Question',
				faqs: faqs,
			})
		})
});


module.exports = router;


