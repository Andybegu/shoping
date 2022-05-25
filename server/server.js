import express  from "express";
import dotenv from "dotenv"
import connectDatabase from "./config/mongodb.js";
import importData from "./dataImport.js";
import { errorHandler, notFound } from "./middleware/Error.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import productRouter from "./routes/productRoutes.js";


dotenv.config();
connectDatabase();
const app=express();
app.use(express.json())
app.use("/api/import",importData)
app.use("/api/products",productRouter)
app.use("/api/users",userRouter)
app.use("/api/orders",orderRouter)
app.get("/api/config/paypal", (req, res)=>{res.send(process.env.PAYPAL_CLIENT_ID)})
app.use(notFound)
app.use(errorHandler)

const PORT=process.env.PORT || 1000

app.listen(PORT,console.log(`server connected on port ${PORT}`));