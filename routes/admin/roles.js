const express = require('express');
const router = express.Router();

const { ensureAuthenticated,checkLogin,checkMainAdmin,checkCoAdmin } = require('../../middlewares/admin');

const { roleValidator,roleEditValidator } = require('../../middlewares/roleValidator');

const Role = require('../../models/Role');

router.get('/roles',ensureAuthenticated,checkCoAdmin,(req,res) => {
	Role.find({})
		.then(roles => {
			res.render('admin/roles/roles',{
				title: 'Roles',
				roles: roles,
				message: req.flash('success'),
			})
		})
		.catch(err => console.log(err));

});

router.get('/add-role',ensureAuthenticated,checkMainAdmin,(req,res) => {
	res.render('admin/roles/add-role',{
		title: 'Add Role',
		validation_errors: req.flash('errors'),
		error_message: req.flash('error'),
		message: req.flash('success'),
		data: req.flash('data')[0]
	})

});

router.post('/add-role',ensureAuthenticated,checkMainAdmin,roleValidator,(req,res) => {

	const role = new Role();

	role.name = req.body.name;

	role.save()
		.then(role => {
			req.flash('success','SuccessFuly Add a Role');
			return res.redirect('/admin-role/roles');
		})
		.catch(err => {
			let = validationErrors = []
			if (err.name === 'MongoError' && err.code === 11000){
				validationErrors.push('Please Select An Unique Role')
			}

	        req.flash('errors',validationErrors);
	        req.flash('data',req.body);
			console.log(err.name)
	        return res.redirect('/admin-role/add-role');
		});
});



router.delete('/delete/:id',ensureAuthenticated,checkMainAdmin,(req , res) => {
   Role.deleteOne({_id: req.params.id})
    .then(() => {
    	req.flash('success','Role Deleted Successfully..');
    	res.redirect('/admin-role/roles');
    })
});



module.exports = router;
