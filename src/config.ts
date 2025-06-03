import dotenv from "dotenv";
dotenv.config();

const config = () => {
  if (process.env.MONGO_URI === undefined) {
    throw new Error("MONGO_URI must be provided");
  }
  if (process.env.PORT === undefined) {
    throw new Error("PORT must be provided");
  }

  if (process.env.JWT_SECRET === undefined) {
    throw new Error("JWT_SECRET must be provided");
  }

  return {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
  }
};

export default config;
