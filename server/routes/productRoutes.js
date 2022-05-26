import express from "express";
import asyncHandler from "express-async-handler";
import {protect,admin} from "../middleware/authMiddleware.js";
import Product from "../model/productModel.js";


const productRouter=express();


//get all products
productRouter.get("/",asyncHandler(
    async(req,res)=>{
        const pageSize=12;
        const page=Number(req.query.pageNumber) || 1
        const keyword=req.query.keyword?{
         name:{
             $regex:req.query.keyword,
             $options:"i"
         }
        }:{};
        const count=await Product.countDocuments({...keyword})
        const products=await Product.find({...keyword})
        .limit(pageSize)
        .skip(pageSize *(page-1))
        .sort({_id:-1}); 
       res.json({products,page,pages:Math.ceil(count/pageSize)})
    
    }
))
//admin get all products
productRouter.get("/all",
protect,
admin, 
asyncHandler(async(req,res)=>{
  const products=await Product.find({})
  res.json(products)
})
)
  //get single product
productRouter.get("/:id",asyncHandler(
    async(req,res)=>{
        const product=await Product.findById(req.params.id)
       if(product){
        res.json(product)
       }
       else{
           res.status(404)
           throw new Error("product not found")
       }
    }
))
//products preview
productRouter.post("/:id/review",
protect,
asyncHandler(async(req,res)=>{
    const {rating, comment}=req.body;
    const product =await Product.findById(req.params.id)
    if(product){
        const alreadyReviewd=product.reviews.find(
            (r)=>r.user.toString()===req.user._id.toString()
        )
        if(alreadyReviewd){
            res.status(400);
            throw new Error("product not revied");
        }
        const review={
            name:req.user.name,
             rating:Number(rating),
             comment,
             user:req.user._id
        };
        product.reviews.push(review);
        product.numReview=product.reviews.length;
        product.rating=
        product.reviews.reduce((acc,item)=>item.rating + acc, 0)/
        product.reviews.length;
        await product.save()
        res.status(201).json({message:"reviewd added"})
    }
    else {
        res.status(404);
        throw new Error("no reviews")
    }
}))
// delete product
productRouter.delete(
    "/:id",
    protect,
    admin,
    asyncHandler(async (req, res) => {
      const product = await Product.findById(req.params.id);
      if (product) {
        await product.remove();
        res.json({ message: "Product deleted" });
      } else {
        res.status(404);
        throw new Error("Product not Found");
      }
    })
  );
//create product
productRouter.post(
    "/",
    protect,
    admin,
    asyncHandler(async (req, res) => {
      const { name, price, description, image, countInStock } = req.body;
      const productExist = await Product.findOne({ name });
      if (productExist) {
        res.status(400);
        throw new Error("Product name already exist");
      } else {
        const product = new Product({
          name,
          price,
          description,
          image,
          countInStock,
          user: req.user._id,
        });
        if (product) {
          const createdproduct = await product.save();
          res.status(201).json(createdproduct);
        } else {
          res.status(400);
          throw new Error("Invalid product data");
        }
      }
    })
  );

productRouter.put(
    "/:id",
    protect,
    admin,
    asyncHandler(async (req, res) => {
      const { name, price, description, image, countInStock } = req.body;
      const product = await Product.findById(req.params.id);
      if (product) {
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.image = image || product.image;
        product.countInStock = countInStock || product.countInStock;
  
        const updatedProduct = await product.save();
        res.json(updatedProduct);
      } else {
        res.status(404);
        throw new Error("Product not found");
      }
    })
  );

export default productRouter;