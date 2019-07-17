const express = require('express');
const router = express.Router();

const WishList = require('../models/WishList');

const { ensureAuthenticated,checkLogin } = require('../middlewares/auth');


router.get('/',ensureAuthenticated,(req,res) => {
	WishList.find({user:req.user._id})
		.populate('product')
		.then(wishlists => {
			res.render('main/wishlists',{
				title : 'Your Wish Lists',
				wishlists: wishlists,
				message: req.flash('success'),
			})
		})
});



router.get('/add/:id',ensureAuthenticated,(req,res) => {

	WishList.findOne({product: req.params.id})
		.then(wishlist => {
			if(!wishlist){
				const newWishList = new WishList();
				newWishList.product = req.params.id;
				newWishList.user = req.user._id;

				newWishList.save()
					.then(savedWishlist => {
						req.flash('success','Product Added To Your WishList');
						return res.redirect('/wishlist');
					})
					.catch(err => console.log(err));

			}else{
				req.flash('success',`Product is already in wishlist`);
				return res.redirect('/wishlist');
			}
		})
		.catch(err => console.log(err));
});


router.delete('/clear',ensureAuthenticated,(req,res) => {
	WishList.deleteMany({user:req.user._id})
		.then(deleted => {
			req.flash('success','Your Wishlist Clear SuccessFully');
			return res.redirect('/wishlist');
		})
		.catch(err => console.log(err));
});


module.exports = router;
