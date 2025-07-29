require('dotenv').config();
const cors=require('cors');
const express=require('express');
const app=express();
app.use(cors());
const connectDB=require('./config/mongodb');
const indexRouter=require('./routes/index.routes');
const userRouter=require('./routes/user.routes');
const productRouter=require('./routes/products.routes');
const PORT=process.env.PORT || 3000;
const path=require('path');



app.set("view engine",'ejs');
// ✅ Add this middleware for req.body ok 
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

connectDB();

app.use("/",indexRouter);
app.use('/user',userRouter);
app.use("/product",productRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});


app.listen(PORT,()=>{
  console.log(`Server is running on PORT: http://localhost:${PORT}`);
})


