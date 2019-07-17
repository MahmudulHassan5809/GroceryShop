const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const router = express.Router();



router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/users/login' }),(req, res) => {
    // res.redirect('/users/profile');
    res.redirect('/');
  });


router.get('/facebook', passport.authenticate('facebook', {scope: 'email'}));


router.get('/facebook/callback',
  passport.authenticate('facebook',
    {
      successRedirect: '/',
      failureRedirect: '/users/login',
      failureFlash: true
    }));

router.get('/verify',(req , res)=>{
	if(req.user){
		console.log(req.user);
	}else{
		console.log('Not Auth');
	}
});


module.exports = router;
