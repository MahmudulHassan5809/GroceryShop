const express = require('express');
const router = express.Router();


const crypto = require('crypto');
const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');


const passport = require('passport');

const User = require('../models/User');
const Order = require('../models/Order');

const { signupValidator,forgotpassValidator,resetpassValidator } = require('../middlewares/validator');
const { ensureAuthenticated,checkLogin } = require('../middlewares/auth');

const secret = require('../config/secret');

router.get('/signup',checkLogin,(req,res) => {
	res.render('users/signup',{
		title: 'SignUp',
		error_message: req.flash('error'),
		validation_errors: req.flash('errors'),
		data: req.flash('data')[0]
	})
});


router.post('/signup',signupValidator,checkLogin,(req,res,next) => {
	const  user = new User()

	user.name = req.body.name;
	user.email = req.body.email;
	user.password = req.body.password;
	user.address = req.body.address;
	user.phone = req.body.phone;
	user.photo = user.gravatar();


	User.findOne({ email : req.body.email })
		.then(foundUser => {
			if(foundUser){
				console.log(`${req.body.email} Already exists`);
				req.flash('error','Account with email address already exists');
				req.flash('data',req.body);
				return res.redirect('/users/signup');
			}else{

				user.save()
					.then(user => {
						req.flash('loginMessage','Registration Completed Successfully');
						res.redirect('/users/login')

					})
					.catch(err => {
						console.log(err);
					});
			}
	}).catch(err => console.log(err));
});


router.get('/login',checkLogin,(req,res) => {
	if(req.user) return res.redirect('/');
	res.render('users/login',{
		title: 'Login',
		message : req.flash('loginMessage'),
		error_message: req.flash('error'),
	})
});

router.post('/login',checkLogin,(req, res, next) => {
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});


router.get('/logout',ensureAuthenticated,(req,res,next) => {
	req.logout();
	req.session.destroy((err) => {
		res.redirect('/');
	});

});


router.get('/forgot',(req,res) => {
	res.render('users/forgot',{
		title: 'Forgot Password',
		error_message: req.flash('error'),
		message: req.flash('success'),
		validation_errors: req.flash('errors'),
		data: req.flash('data')[0]
	});
});


router.post('/forgot',forgotpassValidator,(req,res) => {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
	User.findOne({email:req.body.email})
		.then(user => {
			if(user){
				crypto.randomBytes(20,(err,buf) => {
					const rand = buf.toString('hex');
					user.passwordResetToken = rand;
					user.passwordResetExpries = Date.now() + 60*60*1000;

					user.save()
						.then(user => {
							const smtpTransport = nodemailer.createTransport({
								service: 'Gmail',
								auth: {
									user: secret.auth.user,
									pass: secret.auth.pass
								}
							});

							const mailOptions = {
								to: user.email,
								from: `GroceryShop ${secret.auth.user}`,
								subject: 'GroceryShop Application Password Reset Token',
								text: `You Have Requested For Password Reset Token. \n\n Pleae Click On The Link To Complete The Process: \n\n http://localhost:8080/users/reset/${rand} \n\n`
							};
							smtpTransport.sendMail(mailOptions)
								.then(() => {
									req.flash('success','A Password Reset Token has Been Sent To Your Email');
									res.redirect('/users/forgot');
								})
								.catch(err => console.log(err));
						})
						.catch(err => console.log(err));
				});

			}else{
				req.flash('error','Account with email address Does Not exist');
				req.flash('data',req.body);
				return res.redirect('/users/forgot');
			}
		})
		.catch(err => console.log(err));
});

router.get('/reset/:token',(req,res) => {
	User.findOne({passwordResetToken:req.params.token, passwordResetExpries: {$gt: Date.now()}})
		.then(user => {
			if(!user){
				console.log('okk');
				req.flash('error','Password Reset Token Has Expried Or Is Invalid.');
				return res.redirect('/users/forgot');
			}else{
				console.log('ok')
				res.render('users/reset',{
					title: 'Reset Passwors',
					validation_errors : req.flash('errors'),
					error_message : req.flash('error')
				})
			}
		})
		.catch(err => console.log(err));
});


router.post('/reset/:token',resetpassValidator,(req,res) => {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
	User.findOne({passwordResetToken:req.params.token, passwordResetExpries: {$gt: Date.now()}})
		.then(user => {
			if(req.body.password === req.body.confirm_password){
				if(user){
				user.password = req.body.password;
				user.passwordResetToken = undefined;
				user.passwordResetExpries = undefined;
				user.save()
					.then(user => {
						const smtpTransport = nodemailer.createTransport({
								service: 'Gmail',
								auth: {
									user: secret.auth.user,
									pass: secret.auth.pass
								}
							});

							const mailOptions = {
								to: user.email,
								from: `GroceryShop ${secret.auth.user}`,
								subject: 'GroceryShop Application Password Changed',
								text: `This Is COnfirmation That You Updated The Password For ${user.email}`
							};
							smtpTransport.sendMail(mailOptions)
								.then(() => {
									req.flash('loginMessage','Your password Has Been Changed SuccessFully');
									res.redirect('/users/login')
								})
								.catch(err => console.log(err));

					})
					.catch(err => console.log(err));
				}else{
					req.flash('error','Password Reset Token Has Expried Or Is Invalid.');
					return res.redirect('/users/forgot');
				}
			}else{
				req.flash('error','Confirm Password Does Not Match');
				res.redirect('/users/reset/' + req.params.token);
			}
		})
		.catch(err => console.log(err));
});


router.get('/profile',ensureAuthenticated,(req,res) => {
	User.findById({_id:req.user._id})
		.then(user => {
			res.render('users/profile',{
				title: user.name,
				user: user,
				message: req.flash('success'),
			})
		})
		.catch(err => console.log(err));
});

router.post('/profile',ensureAuthenticated,(req,res) => {
	User.findOneAndUpdate({_id:req.user._id},{
		 "$set": {
		 	"name": req.body.name,
		 	"email": req.body.email,
		 	"phone": req.body.phone,
		 	"address": req.body.address,
		 	}
		})
		.then(user => {
			req.flash('success','Profile Updated Successfully');
			return res.redirect('/users/profile/');
		})
		.catch(err => console.log(err));
});

router.get('/history',ensureAuthenticated,(req,res) => {
	Order.find({user:req.user._id})
		.then(history => {
			res.render('main/history',{
				title: 'Your History',
				history: history
			})
		})
		.catch(err => console.log(err));
});


module.exports = router;
