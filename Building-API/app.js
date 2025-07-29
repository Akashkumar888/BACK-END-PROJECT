require('dotenv').config();

const express=require('express');
const app=express();
const path=require('path');

const PORT=process.env.PORT || 3000;
const dbConnect=require('./config/db');



app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));



// app.get('/data',function(req,res){
//   res.render('index');
// });

// app.get('/api/data',function(req,res){
//   res.json({
//     name:'akash',
//     age:'21',
//     email:'akash.2201216cs@iiitbh.ac.in',
//     friends:['ankit','surya','aditya','nitish','Aakash Meena']
//   });
// });


// const indexRouter=require('./routes/indexRouter');

const apiRouter=require('./routes/apiRouter');



// app.use('/',indexRouter);

app.use('/api',apiRouter);









dbConnect();

app.listen(PORT,()=>{
  console.log(`Server is running on PORT: http://localhost:${PORT}`)
});


