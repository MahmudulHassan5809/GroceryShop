const express = require('express');
const router = express.Router();
const path = require('path');
const async = require('async');


const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');

const Nexmo = require('nexmo');
//const socketio = require('socket.io');

const nexmo = new Nexmo({
	apiKey: 'f1772258',
	apiSecret: 'XhS5PQpLVJWGSUZY'
},{debug: true});

const secret = require('../../config/secret');

const { ensureAuthenticated,checkLogin,checkMainAdmin,checkCoAdmin } = require('../../middlewares/admin');


const Order = require('../../models/Order');
const Profit = require('../../models/Profit');
const Employee = require('../../models/Employee');





router.get('/',ensureAuthenticated,checkCoAdmin,(req,res) => {
	Order.find({})
		.populate('user')
		.then(orders => {
			Employee.find({})
				.then(employees => {
					res.render('admin/orders/orders',{
						title: 'Orders',
						orders: orders,
						employees: employees,
						message: req.flash('success'),
					})
				})
				.catch(err => console.log(err));
		})
		.catch(err => console.log(err));
});

router.get('/profit',ensureAuthenticated,checkCoAdmin,(req,res) => {
	Profit.find({})
		.populate('product')
		.populate('order')
		.then(profits => {
			res.render('admin/orders/profits',{
				title: 'Profits',
				profits: profits,
			})
		})
		.catch(err => console.log(err));
});

router.get('/makepaid/:id',ensureAuthenticated,checkCoAdmin,(req,res) => {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
	Order.findById({_id:req.params.id})
		.populate('user')
		.then(order => {
			order.ispaid = true;
			order.save()
				.then(savedOrder => {
					require('../../helpers/createInvoice')(savedOrder,savedOrder.user,path.join(__dirname, '../../public/invoice/' + `${savedOrder.id}.pdf`));

					const smtpTransport = nodemailer.createTransport({
						service: 'Gmail',
						auth: {
							user: secret.auth.user,
							pass: secret.auth.pass
						}
					});

					const mailOptions = {
						to: savedOrder.user.email,
						from: `GroceryShop ${secret.auth.user}`,
						subject: 'Money Paid',
						text: `Thank You For Paid Your Due.`,
						attachments: [{
						    filename: 'file.pdf',
						    path: path.join(__dirname, '../../public/invoice/' + `${savedOrder.id}.pdf`),
						    contentType: 'application/pdf'
						}]
					};

					smtpTransport.sendMail(mailOptions)
						.then(() => {
							return res.redirect('/admin-order/');
						})
						.catch(err => console.log(err));
					//return res.redirect('/admin-order/');
				})
				.catch(err => console.log(err));

		})
		.catch(err => console.log(err));
});

router.put('/delivery/:id',ensureAuthenticated,checkCoAdmin,(req,res) => {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
	async.waterfall([
		(callback) => {
			Employee.findOneAndUpdate({_id:req.body.employee},
				{$push: {order: req.params.id}}
			)
			.then(updatedEmployee => {
				callback(null,updatedEmployee);
			})
			.catch(err => console.log(err));
		},
		(employee,callback) => {
			Order.findById({_id:req.params.id})
				.populate('user')
				.then(order => {
					const number = '88' + employee.phone;
					const text = `${employee.name} You Have To Deliver The Order ${order.invoice} To The ${order.user.name}.Customer Phone ${order.user.phone}`;

					nexmo.message.sendSms(
						'+8801914614073', number, text, { type: 'unicode' },
						(err,responseData) => {
							if(err){
								console.log(err);
							}else{
								callback(null);
							}
						})

				})
				.catch(err => console.log(err));
		},
		(callback) => {
			Order.findById({_id:req.params.id})
				.populate('user')
				.then(order => {
					//require('../../helpers/invoice')(savedOrder,order.user);
					//require('../../helpers/createInvoice')(savedOrder,order.user,path.join(__dirname, '../../public/invoice/' + `${order.phone}.pdf`));

					order.isdeliver = true;

					order.save()
						.then(savedOrder => {
							require('../../helpers/createInvoice')(savedOrder,savedOrder.user,path.join(__dirname, '../../public/invoice/' + `${savedOrder.id}.pdf`));

							const smtpTransport = nodemailer.createTransport({
								service: 'Gmail',
								auth: {
									user: secret.auth.user,
									pass: secret.auth.pass
								}
							});

							const mailOptions = {
								to: savedOrder.user.email,
								from: `GroceryShop ${secret.auth.user}`,
								subject: 'Order Delivery',
								text: `Your Order HasBeen Delivered From GroceryShop`,
								attachments: [{
								    filename: 'file.pdf',
								    path: path.join(__dirname, '../../public/invoice/' + `${savedOrder.id}.pdf`),
								    contentType: 'application/pdf'
								}]
							};

							smtpTransport.sendMail(mailOptions)
								.then(() => {
									return res.redirect('/admin-order/');
								})
								.catch(err => console.log(err));

							//return res.redirect('/admin-order/');
						})
						.catch(err => console.log(err));
				})
				.catch(err => console.log(err));
		}
	])
});


router.get('/delivery/:id',ensureAuthenticated,checkCoAdmin,(req,res) => {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
	Order.findById({_id:req.params.id})
		.populate('user')
		.then(order => {
			//require('../../helpers/invoice')(savedOrder,order.user);
			//require('../../helpers/createInvoice')(savedOrder,order.user,path.join(__dirname, '../../public/invoice/' + `${order.phone}.pdf`));

			order.isdeliver = true;

			order.save()
				.then(savedOrder => {
					require('../../helpers/createInvoice')(savedOrder,savedOrder.user,path.join(__dirname, '../../public/invoice/' + `${savedOrder.id}.pdf`));

					const smtpTransport = nodemailer.createTransport({
						service: 'Gmail',
						auth: {
							user: secret.auth.user,
							pass: secret.auth.pass
						}
					});

					const mailOptions = {
						to: savedOrder.user.email,
						from: `GroceryShop ${secret.auth.user}`,
						subject: 'Order Delivery',
						text: `Your Order HasBeen Delivered From GroceryShop`,
						attachments: [{
						    filename: 'file.pdf',
						    path: path.join(__dirname, '../../public/invoice/' + `${savedOrder.id}.pdf`),
						    contentType: 'application/pdf'
						}]
					};

					smtpTransport.sendMail(mailOptions)
						.then(() => {
							return res.redirect('/admin-order/');
						})
						.catch(err => console.log(err));

					//return res.redirect('/admin-order/');
				})
				.catch(err => console.log(err));

		})
		.catch(err => console.log(err));
});


router.delete('/delete/:id',ensureAuthenticated,checkCoAdmin,(req,res) => {
	Order.findOneAndRemove({_id:req.params.id})
		.then(deleted => {
			Profit.deleteMany({order: req.params.id})
			.then(profitDeleted => {
				req.flash('success','Order Deleted SuccessFully');
				return res.redirect('/admin-order/');
			})
		})
		.catch(err => console.log(err));
})

module.exports = router;
