
import express from 'express'
const userRouter=express.Router();
import { getUserProfile, loginUser, logoutUser, registerUser } from '../controllers/user.controller.js';
import {body} from 'express-validator'
import { authUser } from '../middlewares/auth.middleware.js';
import blacklistTokenModel from '../models/blacklistToken.model.js';

userRouter.post("/register",[
  body('email').isEmail().withMessage('Invalid email'),
  body('fullName.firstname').isLength({min:3}).withMessage('First name must be at least 3 characters long'),
  body('password').isLength({min:6}).withMessage("password must be 6 characters long"),
],registerUser);

userRouter.post("/login",[
  body('email').isEmail().withMessage("Invalid email"),
  body('password').isLength({min:6}).withMessage("Invalid password")
],loginUser);


userRouter.get("/profile",authUser, getUserProfile);
userRouter.get("/logout",authUser,logoutUser);


export default userRouter;
