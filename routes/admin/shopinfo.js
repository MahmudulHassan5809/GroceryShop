const express = require('express');
const router = express.Router();

const { ensureAuthenticated,checkLogin,checkMainAdmin,checkCoAdmin } = require('../../middlewares/admin');

const { validateShopInfoMiddleware,validateEditShopInfoMiddleware } = require('../../middlewares/shopinfo');


const ShopInfo = require('../../models/ShopInfo');


router.get('/',ensureAuthenticated,checkCoAdmin,(req,res) => {
	ShopInfo.findOne({})
		.then(info => {
			res.render('admin/shopinfo/shopinfo',{
				title: 'Shop Info',
				shopinfo: info,
				message: req.flash('success'),
				error_message: req.flash('error'),
			})
		})
		.catch(err => console.log(err));
});

router.get('/addinfo',ensureAuthenticated,checkCoAdmin,(req,res) => {
	ShopInfo.find({})
		.then(info => {
			if(info.length >= 1){
				req.flash('error',"Please Updated Existing Info");
				return res.redirect('/admin-shopinfo/');
			}else{
				res.render('admin/shopinfo/addinfo',{
					title: 'Add Shop Info',
					validation_errors: req.flash('errors'),
					error_message: req.flash('error'),
					message: req.flash('success'),
					data: req.flash('data')[0]
				});
			}

		})
		.catch(err => console.log(err));

});


router.post('/addinfo',ensureAuthenticated,checkCoAdmin,validateShopInfoMiddleware,(req,res) => {

	const socialSite = {
		facebook: req.body.facebook,
		twitter: req.body.twitter,
		google: req.body.google,
		linkedin: req.body.linkedin,
		instagram: req.body.instagram,
	}

	ShopInfo.create({
		name: req.body.name,
		sologan: req.body.sologan,
		address: req.body.address,
		email: req.body.email,
		phone: req.body.phone,
		fax: req.body.fax,
		about: req.body.about,
		social: socialSite
	})
	.then(creted => {
		req.flash('success','Shop Info Added');
		return res.redirect('/admin-shopinfo/');
	})
	.catch(err => console.log(err));

});


router.get('/edit/:id',ensureAuthenticated,checkCoAdmin,(req,res) =>{
	ShopInfo.findById({_id: req.params.id})
		.then(info => {
			res.render('admin/shopinfo/editinfo',{
				title: 'Edit Shop Info',
				shopinfo: info,
				validation_errors: req.flash('errors'),
				error_message: req.flash('error'),
				message: req.flash('success'),
				data: req.flash('data')[0]
			})
		})
		.catch(err => console.log(err));
});

router.put('/edit/:id',ensureAuthenticated,checkCoAdmin,validateEditShopInfoMiddleware,(req,res) => {
	const socialSite = {
		facebook: req.body.facebook,
		twitter: req.body.twitter,
		google: req.body.google,
		linkedin: req.body.linkedin,
		instagram: req.body.instagram,
	}
	ShopInfo.findOneAndUpdate({_id:req.params.id},
		{
			"$set": {
				"name": req.body.name,
				"sologan": req.body.sologan,
				"address": req.body.address,
				"email": req.body.email,
				"phone": req.body.phone,
				"fax": req.body.fax,
				about: req.body.about,
				"social": socialSite
			},

    	}
	)
	.then(updated => {
		req.flash('success','Shop Info Updated');
		return res.redirect('/admin-shopinfo/');
	})
	.catch(err => console.log(err));
});


module.exports = router;
