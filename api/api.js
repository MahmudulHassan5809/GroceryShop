const express = require('express');
const router = express.Router();

const async = require('async');
const faker = require('faker');
const slugs = require("url-slug")

const Category = require('../models/Category');
const Product = require('../models/Product');

const { ensureAuthenticated,checkLogin,checkMainAdmin,checkCoAdmin } = require('../middlewares/admin');


router.get('/:name',ensureAuthenticated,checkMainAdmin,(req,res,next) => {
	async.waterfall([

		(callback) => {
			Category.findOne({ name: req.params.name })
					.then(category => {
						callback(null,category);
					})
					.catch(err => console.log(err));
		},

		(category,callback) => {
			for (var i = 0; i < 20 ; i++) {
				const product = new Product();
				product.category = category._id;
				product.name = faker.commerce.productName();
				product.price = faker.commerce.price();
				product.sellingPrice = faker.commerce.price();
				product.quantity = faker.random.number(5) + 10;
				product.slug = slugs(faker.commerce.productName());
				product.description = faker.lorem.paragraph();
				product.image = faker.image.food();

				product.buyer = req.session.adminId;

				product.save()
					.then(product => {

					})
					.catch(err => console.log(err));
			}
		}

	]);

	res.json({message : 'Success'});
});


router.post('/search',(req,res,next) => {
	const search = req.body.q;
	console.log(search);
	Product.find({ 'name' : { '$regex' : search, '$options' : 'i' } })
		.populate('category')
		.then(products => {
			res.json(products);
		})
		.catch(err => console.log(err));
});



var request = require('request');

var params = {
    'user-id': 'mahmudul5809',
    'api-key': 'SmzGGdwGYqTcsC2qBH2lDTDfMHYmOGnNMnYuW9BrNzhlT7mE',
};





module.exports = router;
