
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import { connectToDB } from "./db";
import config from "./config";

declare module "express-serve-static-core" {
  interface Request {
    file: any;
    files: any;
    user: {
      id: string;
      email: string;
    };
  }
}


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

app.use("*splat", (req: Request, res: Response) => {
  res.status(404).send("Route Not Found");
});
  
connectToDB().then(() => {
  app.listen(config().PORT, () => {
    console.log(`Server is running on port ${config().PORT}`);
  });
});
  