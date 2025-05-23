import dotenv from "dotenv";
dotenv.config();

const config = () => {
  if (process.env.MONGO_URI === undefined) {
    throw new Error("MONGO_URI must be provided");
  }
  if (process.env.PORT === undefined) {
    throw new Error("PORT must be provided");
  }

  return {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT,
  }
};

export default config;
