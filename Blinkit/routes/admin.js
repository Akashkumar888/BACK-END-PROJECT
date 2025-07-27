require('dotenv').config();
// process.env.ADMIN_PASSWORD and process.env.JWT_KEY exist

const express=require('express');
const router=express.Router();

const {adminModel}=require('../models/admin');
const {productModel}=require('../models/product');
const {categoryModel}=require('../models/category');
const {validateAdmin}=require('../middleware/admin');

const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

//Difference between .create() and new + save()
// Method	                                       Description
// adminModel.create({...})	                     Creates and saves the document in one step
// new adminModel({...}); await user.save();	   Creates the document first, then you manually call .save()
// create() already saves the document, so you can remove user.save().


if(typeof process.env.NODE_ENV !== 'undefined' 
  && process.env.NODE_ENV==='DEVELOPMENT'){

  router.get('/create',async (req,res)=>{
    try{
    const existing = await adminModel.findOne({ email: "admin@blink.com" });
    if(existing) return res.status(400).send("Admin already exists");

    const salt=await bcrypt.genSalt(10);
    const hash= await bcrypt.hash(process.env.ADMIN_PASSWORD , salt);

    const user=new adminModel({
    name: "Akash kumar",
    email: "admin@blink.com",
    password: hash,
    role: "admin",
    });
    await user.save();
    let token=jwt.sign({email: user.email,admin:true},process.env.JWT_KEY,
      {expiresIn:'1h'}
    );

//     let token = jwt.sign({ email: 'admin@blink.com' }, process.env.JWT_KEY, {
//   expiresIn: '1h', // or '7d'
// });

    res.cookie("token",token);
    res.status(201).send("Admin created successfully...");
    }
    catch(err){
    res.status(500).json({ message: 'Server error' });
    }
  })
}


router.get('/login',(req,res)=>{
  res.render('admin_login');
})


router.post('/login',async (req,res)=>{
  try{
    let {email,password}=req.body;
     const admin=await adminModel.findOne({email});
     if (!admin) return res.status(404).send("Admin not found");
  
     const match=await bcrypt.compare(password, admin.password);
     if(!match)return res.status(400).send("password incorrect");
    let token=jwt.sign({email: admin.email,admin:true},process.env.JWT_KEY,
      {expiresIn:'1h'}
    );
    res.cookie("token",token);
    res.redirect("/admin/dashboard");
  }
  catch(err){
   res.status(500).send(err.message);
  }
})



router.get("/dashboard", validateAdmin, async (req, res) => {
  try {
    const prodcount = await productModel.countDocuments();
    const categcount = await categoryModel.countDocuments();
    
    res.render("admin_dashboard", {prodcount,categcount} );// send data for rendering ejs page dynamically variable name same for routes and ejs page 

  } catch (err) {
    console.error(err);
    res.status(500).send("Dashboard Load Error");
  }
});





// router.get("/products",validateAdmin ,async (req,res)=>{
  //   try{
    //     const products=await productModel.find();
    //     res.render('admin_products',{products});
    //   }
    //   catch(err){
      //     res.status(502).send('Internal Server Error');
      //   }
      // });
      

      // here aggregate function used here 
router.get("/products",validateAdmin ,async (req,res)=>{
  const resultArray=await productModel.aggregate([
    {
      $group:{
        _id:'$category',
        products:{$push:"$$ROOT"},
      }
    },
    {
      $project:{
        _id:0,
        category:"$_id",
        products:{$slice: ["$products",10]},
      }
    }
  ])
  // convert array to object
  const resultObject=resultArray.reduce((acc,item)=>{
  acc[item.category]=item.products;
  return acc;
  },{});
  res.render('admin_products',{products: resultObject});
});


// router.get("/logout",validateAdmin , (req,res)=>{
// res.cookie("token","");
// res.redirect('/admin/login');

// })

router.get('/logout', validateAdmin, (req, res) => {
  res.clearCookie('token');
  res.redirect('/admin/login');
});


module.exports=router;


