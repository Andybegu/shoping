import mongoose from "mongoose";


const connectDatabase=async()=>{
    try{
        const connect= mongoose.connect(process.env.MONGO_URL);
        console.log("database connected successfully");
    }
    catch(error){
        console.log(`error:${error}`);
    }
}

export default connectDatabase;