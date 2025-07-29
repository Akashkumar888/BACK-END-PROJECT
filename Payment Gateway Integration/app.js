require('dotenv').config();

const express=require('express');
const app=express();
const path=require('path');


// const PORT=process.env.PORT || 443; // default HTTPS port
const PORT=process.env.PORT || 3000;
const dbConnect=require('./config/db');

// middleware 
app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));


dbConnect();

const indexRouter=require('./routes/index');

app.use('/',indexRouter);


app.listen(PORT,()=>{
  console.log(`✅ HTTP Server running at http://localhost:${PORT}`);
});

// 🔐 HTTPS is the standard in the industry. Almost all production-level apps and websites use HTTPS.

