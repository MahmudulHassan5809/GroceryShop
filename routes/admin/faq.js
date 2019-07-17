const express = require('express');
const router = express.Router();

const { ensureAuthenticated,checkLogin,checkMainAdmin,checkCoAdmin } = require('../../middlewares/admin');


const { validateFaqMiddleware}  = require('../../middlewares/validateFaqMiddleware');


const Faq = require('../../models/Faq');

router.get('/',ensureAuthenticated,checkCoAdmin,(req,res) => {
	Faq.find({})
		.then(faqs => {
			res.render('admin/faqs/faqs', {
				title : 'Frequenty Asked Questions',
				faqs: faqs,
				message: req.flash('success'),
			})
		})
})

router.get('/add-faq',ensureAuthenticated,checkCoAdmin,(req,res) => {
	res.render('admin/faqs/add-faq', {
		title : 'Frequenty Asked Questions',
		validation_errors: req.flash('errors'),
		error_message: req.flash('error'),
		message: req.flash('success'),
		data: req.flash('data')[0]
	})
});


router.post('/add-faq',ensureAuthenticated,checkCoAdmin,validateFaqMiddleware,(req,res) => {

	const faq = new Faq();

	faq.question = req.body.question;
	faq.answer = req.body.answer;
	faq.save()
		.then(savedFaq => {
			req.flash('success','Faq Added SuccessFully');
			return res.redirect('/admin-faq');
		})
		.catch(err => console.log(err));
});


router.delete('/delete/:id',ensureAuthenticated,checkMainAdmin,(req , res) => {
   Faq.deleteOne({_id: req.params.id})
    .then(() => {
    	req.flash('success','Faq Deleted Successfully..');
    	res.redirect('/admin-faq');
    })
});


module.exports = router;
