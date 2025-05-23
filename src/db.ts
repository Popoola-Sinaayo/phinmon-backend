import mongoose from "mongoose";
import config from "./config";

export const connectToDB = async () => {
  try {
    console.log(config());
    await mongoose.connect(config().MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error);
  }
};
