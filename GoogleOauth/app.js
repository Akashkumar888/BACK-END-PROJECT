require('dotenv').config();
const express=require('express');
const app=express();
const path=require('path');
const PORT=process.env.PORT || 3000;
const expressSession = require('express-session');


app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));


const dbConnect=require('./config/db');
dbConnect();


const passport=require('./config/google_oauth_config'); 

app.use(
  expressSession({
    secret: process.env.EXPRESS_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport for authentication
app.use(passport.initialize())
// Enable persistent login sessions
app.use(passport.session())
// Use custom middleware to check database connection

const authRouter=require('./routes/auth');


app.use('/auth',authRouter);


app.listen(PORT,()=>{
  console.log(`Server is running on PORT:http://localhost:${PORT}`);
});



