const express = require('express');
const mongoose = require('mongoose');

const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');

const Contact = require('../models/Contact');

const router = express.Router();

const { ensureAuthenticated,checkLogin } = require('../middlewares/auth');

router.get('/',(req,res) => {
	res.render('main/contact',{
		title: 'যোগাযোগ',
	})
})

router.post('/',ensureAuthenticated,(req,res) => {
	const contact = new Contact();
	contact.user = req.user._id;
	contact.name = req.body.formData.name;
	contact.email = req.body.formData.email;
	contact.subject = req.body.formData.subject
	contact.message = req.body.formData.message

	contact.save()
		.then(savedContact => {
			return res.json('okkk');
		})
		.catch(err => console.log(err));
})

module.exports = router;
