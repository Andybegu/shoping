import express from "express";
import products from "./data/Products.js";
import Users from "./data/users.js";
import Product from "./model/productModel.js";
import User from "./model/userModel.js";

const importData=express.Router();

importData.post("/user",async (req,res)=>{
    await User.deleteMany({});
    const importUser= await User.insertMany(Users)
     res.send({importUser})
})
importData.post("/product",async (req,res)=>{
    await Product.deleteMany({});
    const importProduct= await Product.insertMany(products)
     res.send({importProduct})
})

export default importData;