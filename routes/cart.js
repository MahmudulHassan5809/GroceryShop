const express = require('express');
const router = express.Router();
const _ = require('underscore');
const async = require('async');
const invNum = require('invoice-number')
const path = require('path');

const Product = require('../models/Product');
const Profit = require('../models/Profit');
const Order = require('../models/Order');

const { ensureAuthenticated,checkLogin } = require('../middlewares/auth');

/**
 *
 * Get Add To Cart
 *
 */
router.post('/add',ensureAuthenticated,(req,res) => {
	const id = req.body.product_id
	Product.findOne({_id:id})
	.populate('category')
	.then(product => {
		if(typeof req.session.cart == 'undefined'){
			req.session.cart = [];
			req.session.cart.push({
				id: product._id,
				title:product.name,
				category:product.category.name,
				qty: 1,
				price: parseFloat(product.sellingPrice).toFixed(2),
				image: product.image,
			});
		}else{
			const cart = req.session.cart;
			let newItem;
			newItem = true;

			for (var i = 0; i < cart.length; i++) {
				if(cart[i].id === id){
					cart[i].qty++;
					newItem = false;
					break;
				}
			}

			if(newItem){
				cart.push({
				id: product._id,
				title:product.name,
				category:product.category.name,
				qty: 1,
				price: parseFloat(product.sellingPrice).toFixed(2),
				image: product.image,
			   });
			}
		}

		//console.log(req.session.cart);
		//req.flash('success','Product Added To Cart');
		//res.redirect('back');
		res.json(req.session.cart.length);
	})
	.catch(err => console.log(err));

});

/**
 *
 * Get cart Page
 *
 */
router.get('/cart',ensureAuthenticated,(req,res) => {
	if(req.session.cart && req.session.cart.length == 0){
		delete req.session.cart;
		res.redirect('/cart/cart');
	}else{
		res.render('main/cart',{
		title: 'Shopping Cart',
		cart: req.session.cart,
		message: req.flash('success'),
		error_message: req.flash('error'),
	 });
	}

});


/**
 *
 * Clear Cart Page
 *
 */
router.get('/clear',ensureAuthenticated,(req,res) => {
	delete req.session.cart;
	req.flash('success','Cart Clear SuccessFully');
	res.redirect('/cart/cart');

});


/**
 *
 * Get Update Cart Page
 *
 */
router.get('/update/:id',ensureAuthenticated,(req,res) => {
	const id = req.params.id;
	const cart = req.session.cart;
	const action = req.query.action;


	Product.findById({_id:req.params.id},function(err,product){
		if(!err){

			for (var i = 0; i < cart.length; i++) {
				if(cart[i].id == id){
					switch (action) {
						case 'add':
							if(cart[i].qty < product.quantity){
								cart[i].qty++;
								return res.json({
									qty : cart[i].qty,
									price: cart[i].price,
									cart: req.session.cart,
									user: req.user._id
								});
							}else{
								//req.flash('error','We Have Not Enough Amount');
								//return res.redirect('/cart/cart')
								return res.json({
									res: 0,
									cart:req.session.cart,
								});
							}
							break
						case 'remove':
							if(cart[i].qty > 1){
								cart[i].qty--;
								return res.json({
									qty : cart[i].qty,
									price: cart[i].price,
									cart: req.session.cart,
									user: req.user._id
								});
							}else{
								console.log('ok')
								return res.json({
									res: -1,
									cart:req.session.cart,
								});
							}
							break;
						case 'clear':
							cart.splice(i,1);
							if (cart.length == 0 ) delete req.session.cart;
							return res.json({
								cart: req.session.cart,
							});
							break;
						default:
							console.log('Update Problem')
							break;
					}
					break;
				}
			}

			//req.flash('success','Cart Updated');
			//res.redirect('/cart/cart');

		}
	});

});


router.get('/checkout',ensureAuthenticated,(req,res) => {
	res.render('main/checkout',{
		title: 'CheckOut',
		message: req.flash('success')
	})
});

// router.post('/checkout',ensureAuthenticated,(req,res) => {
// 	let i ;
// 	Order.create({
// 		user: req.user._id,
// 		phone: req.body.phone,
// 		address: req.body.address,
// 		email: req.body.email,
// 		order: req.session.cart
// 	})
// 	.then(created => {
// 		otherStuff(created._id);
// 	})
// 	.catch(err => console.log(err));

// 	function otherStuff(orderId){
// 		for(i = 0; i < _.size(req.session.cart) ; i++){
// 			Product.findById({_id:req.session.cart[i].id})
// 				.then(resProduct => {
// 					resProduct.quantity = resProduct.quantity - req.session.cart[i].qty;
// 					resProduct.save()
// 						.then()
// 						.catch(err => console.log(err))

// 					profit = new Profit();
// 					//console.log(req.session.cart[i].id + 'ok')
// 					profit.product = req.session.cart[i].id;
// 					profit.order = orderId;
// 					profit.qty = req.session.cart[i].qty;
// 					profit.profit = (req.session.cart[i].qty * req.session.cart[i].price) - (req.session.cart[i].qty * resProduct.price);

// 					profit.save()
// 						.then()
// 						.catch(err => console.log(err));


// 				})
// 				.catch(err => console.log(err));
// 		}
// 	}

// });


router.post('/checkout',ensureAuthenticated,(req,res) => {

	async.waterfall([
		(callback) => {
			var d = new Date();
			Order.create({
				user: req.user._id,
				invoice: invNum.next(`${d.getFullYear()}/${d.getMonth()}/ABC00${d.getSeconds()}`),
				phone: req.body.phone,
				address: req.body.address,
				email: req.body.email,
				order: req.session.cart
			},function(err,created){
				require('../helpers/createInvoice')(created,created.user,path.join(__dirname, '../public/invoice/' + `${created.id}.pdf`));
				const cart = req.session.cart;
				delete req.session.cart;
				callback(null,created._id,cart);
			})
		},
		(orderId,cart,callback) => {
			for(let i = 0; i < _.size(cart) ; i++){
				Product.findById({_id:cart[i].id},function(err,resProduct){
					if(!err){
						resProduct.quantity = resProduct.quantity - cart[i].qty;

						resProduct.save()
							.then()
							.catch(err => console.log(err))

						profit = new Profit();
						profit.product = cart[i].id;
						profit.order = orderId;
						profit.qty = cart[i].qty;
						profit.profit = (cart[i].qty * cart[i].price) - (cart[i].qty * resProduct.price);

						profit.save()
							.then()
							.catch(err => console.log(err));
					}
				});
			}
			req.flash('success','Your Order Has Been Submitted');
			res.redirect('/cart/checkout');
		},
	]);



});

module.exports = router;


