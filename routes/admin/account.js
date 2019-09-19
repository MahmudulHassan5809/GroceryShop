const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')

const Admin = require('../../models/Admin');
const Role = require('../../models/Role');
const Category = require('../../models/Category');
const Product = require('../../models/Product');
const Profit = require('../../models/Profit');

const { ensureAuthenticated,checkLogin,checkMainAdmin,checkCoAdmin } = require('../../middlewares/admin');

const { validateAdminMiddleware }  = require('../../middlewares/validateAdminMiddleware');


router.get('/create-admin',(req,res,next) => {
	const admin = new Admin();

	admin.email = 'mahmudul@gmail.com';
	admin.name = 'admin';
	admin.role = 'main';
	admin.password = '123456';

	admin.save()
		.then(admin => {
			req.logIn(admin,(err) => {
				if (err) return next(err);
				res.redirect('/admin/dashboard');
			})
		})
		.catch(err => console.log(err));
});

router.get('/add-admin',ensureAuthenticated,checkMainAdmin,(req,res) => {
	Role.find({})
		.then(roles => {
			res.render('admin/accounts/add-admin',{
				title: 'Ad Admin',
				roles: roles,
				validation_errors: req.flash('errors'),
				error_message: req.flash('error'),
				message: req.flash('success'),
				data: req.flash('data')[0]
			})
		})
		.catch(err => console.log(err));
});


router.post('/add-admin',ensureAuthenticated,checkMainAdmin,validateAdminMiddleware,(req,res) => {

	const admin = new Admin();

	admin.email = req.body.email;
	admin.name = req.body.name;
	admin.role = req.body.role;
	admin.password = req.body.password;

	admin.save()
		.then(admin => {
			req.flash('success','Admin Added SuccessFully');
			return res.redirect('/admin/add-admin');
		})
		.catch(err => console.log(err));

});


router.get('/all-admin',ensureAuthenticated,checkMainAdmin,(req,res) => {
	Admin.find({})
		.then(admins => {
			res.render('admin/accounts/all-admin',{
				title: 'All Admin',
				admins: admins,
				error_message: req.flash('error'),
				message: req.flash('success'),
			});
		})
		.catch(err => console.log(err));
});

router.delete('/delete-admin/:id',ensureAuthenticated,checkMainAdmin,(req,res) => {
	Admin.findById({_id: req.params.id})
		.then(admin => {
			if(admin.role == 'main'){
				req.flash('error','Main Admin Can Not Be Deleted');
				return res.redirect('/admin/all-admin');
			}else{
				Admin.deleteOne({_id: req.params.id})
			    .then(() => {
			    	req.flash('success','Admin Deleted Successfully..');
			    	return res.redirect('/admin/all-admin');
			    })
			}
		})
});


router.get('/',ensureAuthenticated,(req,res) => {
	Category.aggregate([
	    {
	        $lookup:
	        {
	            from: 'products',
	            localField: "_id",
	            foreignField: "category",
	            as: 'products'
	        }
	    },
	    {
	        $project:
	        {
	            _id: 1,
	            name: 1,
	            number_of_product: { $size: "$products" }
	        }
	    }
	])
	.then(eachCategoryProducts => {
		var d = new Date();
		var year = d.getFullYear();
		Order.aggregate([
	        { "$match": {
	            "date": {$lt: new Date(), $gt: new Date(year)}
	        	}
	    	},
	        { "$group": {
	            "_id": {
	                "year":  { "$year": "$date" },
	                "month": { "$month": "$date" },
	                "day":   { "$dayOfMonth": "$date" }
	            },
	            "count": { "$sum": 1 }
	        }}
    	])
    	.then(perDayOrder => {
    		Profit.aggregate([
				{
					$project:{
						profit: 1,
						month: { $month: "$date" },
					}
				}
			]).then(perMonthProfit => {
				console.log(perMonthProfit);
				Product.find({},'name quantity')
	    		 	.then(eachProductQuantity => {
	    		 		res.render('admin/accounts/dashboard',{
							title: "Admin DashBoard",
							eachCategoryProducts:eachCategoryProducts,
							perDayOrder: perDayOrder,
							eachProductQuantity: eachProductQuantity,
							perMonthProfit: perMonthProfit,
							message : req.flash('roleMessage'),
						})
	    		 	})
	    		 	.catch(err => console.log(err));
			})
			.catch(err => console.log(err));
		})
		.catch(err => console.log(err));
	})
	.catch(err => console.log(err));
});

router.get('/dashboard',ensureAuthenticated,(req,res) => {
	Category.aggregate([
	    {
	        $lookup:
	        {
	            from: 'products',
	            localField: "_id",
	            foreignField: "category",
	            as: 'products'
	        }
	    },
	    {
	        $project:
	        {
	            _id: 1,
	            name: 1,
	            number_of_product: { $size: "$products" }
	        }
	    }
	])
	.then(eachCategoryProducts => {
		var d = new Date();
		var year = d.getFullYear();
		Order.aggregate([
	        { "$match": {
	            "date": {$lt: new Date(), $gt: new Date(year)}
	        	}
	    	},
	        { "$group": {
	            "_id": {
	                "year":  { "$year": "$date" },
	                "month": { "$month": "$date" },
	                "day":   { "$dayOfMonth": "$date" }
	            },
	            "count": { "$sum": 1 }
	        }}
    	])
    	.then(perDayOrder => {
    		Profit.aggregate([
    			{ "$match": {
		            "date": {$lte: new Date()}
		        	}
	    		},
				{
					$project:{
						profit: 1,
						month: { $month: "$date" },
					}
				}
			]).then(perMonthProfit => {
				Product.find({},'name quantity')
	    		 	.then(eachProductQuantity => {
	    		 		res.render('admin/accounts/dashboard',{
							title: "Admin DashBoard",
							eachCategoryProducts:eachCategoryProducts,
							perDayOrder: perDayOrder,
							eachProductQuantity: eachProductQuantity,
							perMonthProfit: perMonthProfit,
							message : req.flash('loginMessage'),
						})
	    		 	})
	    		 	.catch(err => console.log(err));
			})
			.catch(err => console.log(err));
		})
		.catch(err => console.log(err));
	})
	.catch(err => console.log(err));

});


router.get('/login',checkLogin,(req,res) => {
	res.render('admin/accounts/login',{
		title: 'Login',
		message : req.flash('loginMessage'),
		error_message: req.flash('error'),
	})
});

router.post('/login',checkLogin,(req,res,next) => {
	const { email , password } = req.body;
	Admin.findOne({email: email})
  	.then(user => {
       if(user){
			bcrypt.compare(password,user.password,(error,result) => {
				if(result){
					req.session.adminId = user._id;
					req.session.adminName = user.name;
					res.redirect('/admin/dashboard');
				}else{
					req.flash('loginMessage','PassWord Incorrect');
					res.redirect('/admin/login');
				}
			})
       }else{
       		//req.flash('error_msg','Email Already Registered');
       		req.flash('loginMessage','No User Found');
	    	return res.redirect('/admin/login');
		}
	});
});

router.get('/logout',ensureAuthenticated,(req,res) => {
	req.session.destroy(() => {
		return res.redirect('/admin/login');
	});
});

router.get('/profile',ensureAuthenticated,(req,res) => {
	Admin.findById({_id:req.session.adminId})
		.then(admin => {
			Role.find({})
				.then(roles => {
					res.render('admin/accounts/profile',{
						title: req.session.adminName,
						message: req.flash('success'),
						admin: admin,
						roles: roles
					})
				})
				.catch(err => console.log(err));
		})
		.catch(err => console.log(err));
});


router.post('/profile',ensureAuthenticated,(req,res) => {
	const email = req.body.email;
	const name = req.body.name;
	if(req.body.role){
		const role = req.body.role;
		Admin.findOneAndUpdate({ "_id": req.session.adminId }, { "$set": { "name": name, "email": email, "role": role}})
		.then(admin => {
			req.flash('success','Profile Updated SuccessFully');
			return res.redirect('/admin/profile');
		})
		.catch(err => console.log(err));
	}else{
		Admin.findOneAndUpdate({ "_id": req.session.adminId }, { "$set": { "name": name, "email": email}})
		.then(admin => {
			req.flash('success','Profile Updated SuccessFully');
			return res.redirect('/admin/profile');
		})
		.catch(err => console.log(err));
	}

});

router.get('/password-change',ensureAuthenticated,(req,res) => {
	res.render('admin/accounts/chnage-password',{
		title: 'Change Password',
		error_message: req.flash('error')
	})
});

router.post('/password-chnage',ensureAuthenticated,(req,res) => {
	Admin.findById({_id: req.session.adminId})
		.then(admin => {
			if(req.body.new_password !== req.body.confirm_password){
				req.flash('error','PassWord Does Not Match');
				return res.redirect('/admin/password-change');
			}else if (!req.body.password || !req.body.new_password) {
				req.flash('error','Please Fill All The Filed');
				return res.redirect('/admin/password-change');
			}else{
				bcrypt.compare(req.body.password,admin.password,(error,result) => {
				if(result){
					bcrypt.hash(req.body.new_password,10,function(error,encrypted){
				    	Admin.findOneAndUpdate({ "_id": req.session.adminId }, { "$set": { "password": encrypted}})
							.then(admin => {
								req.flash('success','Password Updated SuccessFully');
								return res.redirect('/admin/profile');
							})
							.catch(err => console.log(err));
					});
				}else{
					req.flash('error','Current PassWord Incorrect');
					res.redirect('/admin/password-change');
				}
			  })
			}
		})
		.catch(err => console.log(err));
});

module.exports = router;
