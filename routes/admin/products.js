const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const slugs = require("url-slug")

const multer  = require('multer')
const date = Date.now();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, date +  file.originalname)
  }
})
const upload = multer({ storage: storage })

const { ensureAuthenticated,checkLogin,checkMainAdmin,checkCoAdmin } = require('../../middlewares/admin');

const { validateProductMiddleware,validateEditProductMiddleware }  = require('../../middlewares/validateProductMiddleware');

const Product = require('../../models/Product');
const Category = require('../../models/Category');



router.get('/products',ensureAuthenticated,checkMainAdmin,(req,res) => {
	Product.find({})
		.populate('buyer')
		.populate('category')
		.then(products => {
			res.render('admin/products/products',{
				title: 'Products',
				products: products,
				message: req.flash('success'),
			})
		})
		.catch(err => console.log(err));
});




router.get('/add-product',ensureAuthenticated,checkMainAdmin,(req,res) => {
	Category.find({})
		.then(categories => {
			res.render('admin/products/add-product',{
				title: 'Add Product',
				categories: categories,
				validation_errors: req.flash('errors'),
				error_message: req.flash('error'),
				message: req.flash('success'),
				data: req.flash('data')[0]
			})
		})
		.catch(err => console.log(err));
});

router.post('/add-product',upload.single('image'),ensureAuthenticated,checkMainAdmin,validateProductMiddleware,(req,res) => {
	if(!req.file){
		req.flash('error','Please Upload An Image');
		req.flash('data',req.body);
		return res.redirect('/admin-product/add-product');
	}

	const product = new Product()
	product.category = req.body.category;
	product.name = req.body.name;
	product.price = req.body.price;
	product.sellingPrice = req.body.sellingPrice;
	product.quantity = req.body.quantity;
	product.slug = slugs(req.body.name);
	product.description = req.body.description;
	product.buyer = req.session.adminId;
	product.image = '/uploads/' + date + req.file.originalname;

	product.save()
		.then(product => {
			req.flash('success','SuccessFuly Add a Prodcut');
			res.redirect('/admin-product/products');
		})
		.catch(err => console.log(err));
});

router.get('/edit/:id',ensureAuthenticated,checkMainAdmin,(req,res) => {
	Product.findOne({
   		_id: req.params.id
   	})
   	.then(product => {
		Category.find({})
			.then(categories => {
				res.render('admin/products/edit-product',{
					title: product.name,
					product: product,
					categories: categories,
					validation_errors: req.flash('errors'),
					message : req.flash('success')
				})
			})
			.catch(err => console.log(err));
   	})
   	.catch(err => console.log(err));
});


router.put('/edit/:id',upload.single('image'),ensureAuthenticated,checkMainAdmin,validateEditProductMiddleware,(req,res) => {
	Product.findOne({_id:req.params.id})
		.then(product => {
			if(!req.file){
				product.category = req.body.category;
				product.name = req.body.name;
				product.price = req.body.price;
				product.sellingPrice = req.body.sellingPrice;
				product.quantity = req.body.quantity;
				product.slug = slugs(req.body.name);
				product.description = req.body.description;
				product.buyer = req.session.adminId;
				product.save()
				.then(product => {
					req.flash('success','Product Updated Successfully..');
			    	res.redirect('/admin-product/products');
				})
				.catch(err => console.log(err));
			}else{
				uploadDir = path.join(__dirname, '../../public');
				fs.unlinkSync(uploadDir + product.image);
				product.category = req.body.category;
				product.name = req.body.name;
				product.price = req.body.price;
				product.sellingPrice = req.body.sellingPrice;
				product.quantity = req.body.quantity;
				product.slug = slugs(req.body.name);
				product.description = req.body.description;
				product.buyer = req.session.adminId;
				product.image = '/uploads/' + date + req.file.originalname;
				product.save()
				.then(product => {
					req.flash('success','Product Updated Successfully..');
			    	res.redirect('/admin-product/products');
				})
				.catch(err => console.log(err));
			}
		})
		.catch(err => console.log(err));
});


router.delete('/delete/:id',ensureAuthenticated,checkMainAdmin,(req , res) => {
   Product.findOne({_id: req.params.id})
   		.then(product => {
   			uploadDir = path.join(__dirname, '../../public')
   			fs.unlinkSync(uploadDir + product.image);
			Product.deleteOne({_id: req.params.id})
			    .then(() => {
			    	req.flash('success','Product Deleted Successfully..');
			    	res.redirect('/admin-product/products');
			    })
			    .catch(err=>console.log(err));
   		})
   		.catch(err => console.log(err));
});


module.exports = router;

