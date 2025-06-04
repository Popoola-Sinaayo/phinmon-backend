import dotenv from "dotenv";
dotenv.config();

const config = () => {
  if (process.env.MONGO_URI === undefined) {
    console.error("MONGO_URI is not defined in the environment variables.");
    throw new Error("MONGO_URI must be provided");
  }
  if (process.env.PORT === undefined) {
    console.error("PORT is not defined in the environment variables.");
    throw new Error("PORT must be provided");
  }

  if (process.env.JWT_SECRET === undefined) {
    console.error("JWT_SECRET is not defined in the environment variables.");
    throw new Error("JWT_SECRET must be provided");
  }

  if (process.env.MONO_BASE_URL === undefined) {
    console.error("MONO_BASE_URL is not defined in the environment variables.");
    throw new Error("MONO_BASE_URL must be provided");
  }

  if (process.env.MONO_SEC_KEY === "undefined") {
    console.error("MONO_SEC_KEY is not defined in the environment variables.");
    throw new Error("MONO_SEC_KEY cannot be 'undefined'");
  }
  return {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    MONO_BASE_URL: process.env.MONO_BASE_URL,
    MONO_SEC_KEY: process.env.MONO_SEC_KEY,
  };
};

export default config;
