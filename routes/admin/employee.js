const express = require('express');
const router = express.Router();

const { ensureAuthenticated,checkLogin,checkMainAdmin,checkCoAdmin } = require('../../middlewares/admin');


const { validateEmployeeMiddleware,validateEditEmployeeMiddleware}  = require('../../middlewares/validateEmployeeMiddleware');


const Employee = require('../../models/Employee');


router.get('/employee',ensureAuthenticated,checkCoAdmin,(req,res) => {
	Employee.find({})
		.populate('order','invoice ispaid')
		.then(employees => {
			res.render('admin/employees/employees',{
				title: 'Employees',
				employees: employees,
				message: req.flash('success'),
			})
		})
		.catch(err => console.log(err));
});


router.get('/add-employee',ensureAuthenticated,checkCoAdmin,(req,res) => {
	res.render('admin/employees/add-employee',{
		title: 'Add Employee',
		validation_errors: req.flash('errors'),
		error_message: req.flash('error'),
		message: req.flash('success'),
		data: req.flash('data')[0]
	})
});


router.post('/add-employee',ensureAuthenticated,checkCoAdmin,validateEmployeeMiddleware,(req,res) => {

	const employee = new Employee()
	employee.name = req.body.name;
	employee.email = req.body.email;
	employee.phone = req.body.phone;

	employee.save()
		.then(savedEmployee => {
			req.flash('success','SuccessFuly Add an EMployee');
			res.redirect('/admin-employee/employee');
		})
		.catch(err => console.log(err));
});

router.get('/edit-employee/:id',ensureAuthenticated,checkCoAdmin,(req,res) => {
	Employee.findById({
   		_id: req.params.id
   	})
   	.then(employee => {
		res.render('admin/employees/edit-employee',{
			title: employee.name,
			employee: employee,
			validation_errors: req.flash('errors'),
			message : req.flash('success')
		})
   	})
   	.catch(err => console.log(err));
});


router.put('/edit-employee/:id',ensureAuthenticated,checkCoAdmin,validateEditEmployeeMiddleware,(req,res) => {
	Employee.findById({
   		_id: req.params.id
   	})
   	.then(employee => {
		employee.name = req.body.name;
		employee.email = req.body.email;
		employee.phone = req.body.phone;

		employee.save()
			.then(updatedEmployee => {
				req.flash('success','Employee Updated Successfully..');
			    res.redirect('/admin-employee/employee');
			})
			.catch(err => console.log(err));
   	})
   	.catch(err => console.log(err));
});

router.delete('/delete-employee/:id',ensureAuthenticated,checkCoAdmin,(req,res) => {
	Employee.findOneAndDelete({_id:req.params.id})
		.then(employeeDeleted => {
			req.flash('success','Employee Deleted Successfully..');
			   res.redirect('/admin-employee/employee');
		})
		.catch(err => console.log(err));
})


module.exports = router;
