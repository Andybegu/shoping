import express from "express"
import asyncHandler from "express-async-handler"
import {protect,admin} from "../middleware/authMiddleware.js";
import User from "../model/userModel.js";
import genrator from "../util/genertaor.js";


const userRouter=express.Router();

//login
userRouter.post("/login",asyncHandler(async (req,res)=>{
    const {email,password}=req.body;
    const user=await User.findOne({ email })
    if(user && (await user.matchPassword(password))){
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
            token:genrator(user._id),
            createdAt:user.createdAt
        });
    }
    else{
    res.status(401);
    throw new Error("invalid email or password");
    }
}))

//register user
userRouter.post("/",asyncHandler(async(req,res)=>{
    const {email,name,password}=req.body;
    const userExist=await User.findOne({email});

    if(userExist){
        res.status(400);
        throw new Error("user already exist");
    }
    const user=await User.create({
        name,
        email,
        password
    })
    if(user){
      res.status(201).json({
        _id:user._id,
        name:user.name,
        email:user.email,
        isAdmin:user.isAdmin,
        token:genrator(user._id)
      });
    }
    else{
      res.status(400);
      throw new Error("invalid user data");
    }
}))


//profile
userRouter.get("/profile",

asyncHandler(async(req,res)=>{
    const user= await User.findById(req.user._id);
    if(user){
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
            createdAt:user.createdAt
        })
    }
    else
    {
        res.status(404);
        throw new Error("user not found");
    }
}))

//update profile
userRouter.put(
    "/profile",
    protect,
    asyncHandler(async (req, res) => {
      const user = await User.findById(req.user._id);
  
      if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
          user.password = req.body.password;
        }
        const updatedUser = await user.save();
        res.json({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
          createdAt: updatedUser.createdAt,
          token: generateToken(updatedUser._id),
        });
      } else {
        res.status(404);
        throw new Error("User not found");
      }
    })
  );

// GET ALL USER ADMIN
userRouter.get(
  "/",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
  })
);

export default userRouter

