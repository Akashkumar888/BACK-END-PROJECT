require('dotenv').config();
const express=require('express');
const app=express();
const path=require('path');
const PORT=process.env.PORT || 3000;
const cookieParser=require('cookie-parser');

const indexRouter=require('./routes/index');
const authRouter=require('./routes/auth');
const adminRouter=require('./routes/admin');
const categoriesRouter=require('./routes/category');
const productRouter=require('./routes/product');
const userRouter=require('./routes/user');
const cartRouter=require('./routes/cart');
const paymentRouter=require('./routes/payment');
const orderRouter=require('./routes/order');



const passport = require('passport');


const expressSession = require('express-session');

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

const dbConnect=require('./config/db');
dbConnect();


require('./config/google_oauth_config'); 

app.use(
  expressSession({
    secret: process.env.EXPRESS_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());


app.use('/',indexRouter);
app.use('/auth',authRouter);
app.use('/admin',adminRouter);
app.use('/products',productRouter);
app.use('/categories',categoriesRouter);
app.use('/users',userRouter);
app.use('/cart',cartRouter);
app.use('/payment',paymentRouter);
app.use('/order',orderRouter);


app.listen(PORT,()=>{
  console.log(`Server is running on PORT:http://localhost:${PORT}`);
});



