import express from "express";
import asyncHandler from "express-async-handler";
import {protect,admin} from "../middleware/authMiddleware.js";
import Order from "../model/orderModel.js";


const orderRouter=express.Router();

// create order
orderRouter.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
      return;
    } else {
      const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createOrder = await order.save();
      res.status(201).json(createOrder);
    }
  })
);

//get admin 
orderRouter.get(
    "/all",
    protect,
    admin,
    asyncHandler(async (req, res) => {
      const orders = await Order.find({})
        .sort({ _id: -1 })
        .populate("user", "id name email");
      res.json(orders);
    })
  );
// get all order
orderRouter.get("/",
protect,
asyncHandler(async(req,res)=>{
    const order =await Order.find({user:req.user.id}).sort({_id:-1})
       res.json(order) 
})
);


//get single order
orderRouter.get("/:id",
protect,
asyncHandler(async(req,res)=>{
    const order =await Order.findById(req.params.id).populate(
        "user",
        "name email"
    )
    if(order){
       res.json(order)
    }else{
   res.status(401)
   throw new Error("no order found")
    }
})
);
//order is payd
orderRouter.put("/:id/pay",asyncHandler(async(req,res)=>{
    const order=await Order.findById(req.params.id)
    if(order){
        order.isPaid=true,
        order.paidAt=Date.now(),
        order.paymentResult={
            id:req.body.id,
            status:req.body.status,
            update_item:req.body.update_item,
            email_address:req.body.email_address
        };
        const updateOrder=await order.save();
        res.json(updateOrder);
    }else{
        res.status(404);
        throw new Error("no updation")
    }

}))

// ORDER IS deliverd
orderRouter.put(
    "/:id/delivered",
    protect,
    asyncHandler(async (req, res) => {
      const order = await Order.findById(req.params.id);
  
      if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
  
        const updatedOrder = await order.save();
        res.json(updatedOrder);
      } else {
        res.status(404);
        throw new Error("Order Not Found");
      }
    })
  );


export default orderRouter
