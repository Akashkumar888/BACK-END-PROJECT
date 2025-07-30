
const express=require('express');
const router=express.Router();
const indexConroller=require('../controllers/index.controller');

router.get('/',indexConroller.index);

module.exports=router;

