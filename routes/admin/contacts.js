const express = require('express');
const router = express.Router();

const { ensureAuthenticated,checkLogin,checkMainAdmin,checkCoAdmin } = require('../../middlewares/admin');


const Contact = require('../../models/Contact');


router.get('/',ensureAuthenticated,checkCoAdmin,(req,res) => {
	Contact.find({})
		.populate('user')
		.then(contacts => {
			res.render('admin/contacts/contacts',{
				contacts : contacts,
				totalContact : contacts.length,
				title: 'Contacts',
				message: req.flash('success')
			})
		})
})

router.get('/view/:id',ensureAuthenticated,checkCoAdmin,(req,res) => {
	Contact.findById({_id:req.params.id})
		.populate('user')
		.then(contact => {
			res.render('admin/contacts/contact',{
				contact : contact,
				title: 'Contacts'
			})
		})
})


router.delete('/delete/:id',ensureAuthenticated,checkCoAdmin,(req , res) => {
   Contact.deleteOne({_id: req.params.id})
    .then(() => {
    	req.flash('success','Message Deleted Successfully..');
    	res.redirect('/admin-message');
    })
});



module.exports = router;
