const facebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const passport = require('passport');

const config = require('./secret');
//Load User model
const User = require('../models/User');

const secret = require('./secret');


module.exports = function(passport){
  passport.use(new facebookStrategy(
  	{
  		clientID:secret.facebook.appID,
  		clientSecret:secret.facebook.secretId,
  		callbackURL: 'http://localhost:8080/auth/facebook/callback',
  		profileFields: ['id','displayName','email'],
  	}, (accessToken,refreshToken,profile,next) => {

     //Match user
     User.findOne({
      facebookId : profile.id
     }).then(user => {
       if(user){
           return next(null,user);
       }else{
       		const newUser = new User();
       		newUser.email = profile._json.email;
       		newUser.facebookID = profile.id;
       		newUser.name = profile.displayName;
       		newUser.photo = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
       		newUser.save()
       			.then(saved => {
					next(null,user)
       			})
       			.catch(err => console.log(err));
       }
	})
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}
