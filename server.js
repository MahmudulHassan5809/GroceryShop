const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const validator = require('express-validator');
const connectMongo = require('connect-mongo');
const mongoose = require('mongoose');
const morgan = require('morgan');
const flash = require('express-flash');
const ejs = require('ejs');
const engine = require('ejs-mate');
const passport = require('passport');
const methodOverride = require('method-override');
const _ = require('underscore');
const moment = require('moment');
const clip = require('text-clipper');


const app = express();


//DB Config
const db = require('./config/database');
//Map Gloabal Promise -get rid of warning
mongoose.Promise = global.Promise;
//Connect To Mongoose
mongoose.connect(db.mongoURI,{
    useNewUrlParser: true,
    useCreateIndex: true
})
.then(() => { console.log('mongodb Connected');})
.catch(err => console.log(err));


// Mongo Store
const MongoStore = connectMongo(session);


//passport config
require('./config/passport')(passport);
require('./config/passportGoogle')(passport);
require('./config/passportFacebook')(passport);




//Static Folder
app.use(express.static(__dirname + '/public'));

//Morgan MiddleWare
app.use(morgan('dev'));


//EJS MiddleWare
app.engine('ejs',engine);
app.set('view engine','ejs');

//Body parser MiddleWare
app.use(bodyParser.urlencoded({ limit: "50mb",extended: true,parameterLimit:50000 }));
app.use(bodyParser.json({limit: "50mb"}));


//Cookie parser MiddleWare
app.use(cookieParser());

// Express Validator
app.use(validator());


//Session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
  	mongooseConnection: mongoose.connection
  })
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session())


//Flash
app.use(flash());




//Method Override
app.use(methodOverride('_method'))

//Global Variable
app.use((req,res,next) => {
  res.locals.user = req.user;
  res.locals.adminName = req.session.adminName;
  res.locals.auth = req.session.adminId;
  res.locals._ = _;
  res.locals.moment = moment;
  res.locals.clip = clip;
  next();
});

const Category = require('./models/Category')
app.use((req,res,next) => {
  Category.find({})
      .then(categories => {
          res.locals.categories = categories;
          next();
      })
      .catch(err => console.log(err));
});


const ShopInfo = require('./models/ShopInfo')
app.use((req,res,next) => {
  ShopInfo.findOne({})
      .then(shopInfo => {
          res.locals.shopInfo = shopInfo;
          next();
      })
      .catch(err => console.log(err));
});

/***************** Cart **************/
app.get('*',(req,res,next)=>{
  res.locals.cart = req.session.cart;
  next();
});

/***************** Cart **************/

//Load Routes
const users = require('./routes/users');
const pages = require('./routes/main');
const auth = require('./routes/auth');
const review = require('./routes/review');
const cart = require('./routes/cart');
const wishlist = require('./routes/wishlist');
const contact = require('./routes/contact');
//Admin Routes
const admin = require('./routes/admin/account');
const adminCategories = require('./routes/admin/categories');
const adminProducts = require('./routes/admin/products');
const adminRoles = require('./routes/admin/roles');
const shopinfo = require('./routes/admin/shopinfo');
const adminorder = require('./routes/admin/orders');
const adminContact = require('./routes/admin/contacts');
const adminFaq = require('./routes/admin/faq');
const admineEmployee = require('./routes/admin/employee');

//User Routes
app.use('/users',users);
//Main Pages Routes
app.use('/',pages);
//Google Auth Routes
app.use('/auth',auth);
//Review Routes
app.use('/review',review);
//Cart Routes
app.use('/cart',cart);
//WishList Routes
app.use('/wishlist',wishlist);
//Contact Routes
app.use('/contact',contact);

//Admin
app.use('/admin',admin);
app.use('/admin-category/',adminCategories);
app.use('/admin-product/',adminProducts);
app.use('/admin-role/',adminRoles);
app.use('/admin-shopinfo/',shopinfo);
app.use('/admin-order/',adminorder);
app.use('/admin-message/',adminContact);
app.use('/admin-faq/',adminFaq);
app.use('/admin-employee/',admineEmployee);

//Load Api Routes
const api = require('./api/api');
app.use('/api',api);


const port = process.env.PORT || 8080;
app.listen(port,() => {
	console.log(`Sever Started on port ${port}`);
});
