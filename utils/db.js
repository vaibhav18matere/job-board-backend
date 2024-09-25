import mongoose from "mongoose";

export const connectDB = async () => {
     try {
          await mongoose.connect(process.env.MONGO_URI);
          console.log('Mongo DB Connected Successfully!');
     } catch (error) {
          console.log(error);
     }
};