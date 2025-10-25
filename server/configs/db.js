import mongoose from "mongoose";

const connectDB = async () =>{
  try{
    mongoose.connection.on("connected", () => 
      console.log("MongoDB connected successfully")
    );
    await mongoose.connect(`${process.env.MONGODB_URI}/zzHotelBooking`);
  } catch{
    console.log("Error in DB connection", error.message);
  }
}

export default connectDB;