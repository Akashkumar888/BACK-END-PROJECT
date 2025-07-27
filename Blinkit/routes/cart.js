
const express=require('express');
const router=express.Router();
const {cartModel,validateCart}=require('../models/cart');
const {validateAdmin,userIsLoggedIn}=require('../middleware/admin');
const { productModel,validateProduct } = require('../models/product');


router.get("/",userIsLoggedIn, async (req,res)=>{
  try{
    // const cart=await cartModel.findOne({user:req.session.passport.user}).populate("products");

    // const cart = await cartModel.findOne({ user: req.user?._id }).populate("products");

    const userId = req.session?.passport?.user;
    if (!userId) return res.status(401).send("User not logged in.");

    const cart = await cartModel.findOne({ user: userId }).populate("products");

    if (!cart || !cart.products || cart.products.length === 0) {
      return res.render("cart", {
        cart: [],
        finalprice: 0,
        userid: userId
      });
    }
    
let cartDataStructure={};

cart.products.forEach((product) => {
  let key=product._id.toString();
  if(cartDataStructure[key]){
    cartDataStructure[key].quantity += 1;
  }
  else{
    cartDataStructure[key]={
      ...product._doc,
      quantity:1
    };
  }
});
let finalarray=Object.values(cartDataStructure);
let finalprice=cart.totalPrice + 34;
res.render("cart",{
  cart: finalarray,
  finalprice: finalprice || 0,
  userid: req.session.passport.user || 'guest'
  });
}
  catch(err){
    res.status(500).send("Internal Server Error.");
  }
});


router.get("/add/:id", userIsLoggedIn, async (req,res)=>{
  try{
    let cart=await cartModel.findOne({user:req.session.passport.user});
    const product=await productModel.findOne({_id:req.params.id});
    if(!product)return res.status(404).send("Product not found.");
    if(!cart){
     cart= await cartModel.create(
        {
        user:req.session.passport.user,
        products: [req.params.id],
        totalPrice:Number(product.price),
        }
      );
    }
    else{
      cart.products.push(req.params.id);
      cart.totalPrice=Number(cart.totalPrice) + Number(product.price);
      await cart.save();
    }
    res.redirect("back");
  }
  catch(err){
    res.status(500).send("Internal Server Error.");
  }
})


router.get("/remove/:id", userIsLoggedIn, async (req,res)=>{
  try{
    let cart=await cartModel.findOne({user:req.session.passport.user});
    if(!cart)return res.status(404).send("Something went wrong while removing item.");
    let index=cart.products.indexOf(req.params.id);
    if (index === -1) return res.status(400).send("Item not in the cart.");

    cart.products.splice(index, 1); // ✅ fix
    const product = await productModel.findById(req.params.id);
    cart.totalPrice = Number(cart.totalPrice) - Number(product.price);
    await cart.save();
    res.redirect("back");
  }
  catch(err){
    res.status(500).send("Internal Server Error.");
  }
})


module.exports=router;


