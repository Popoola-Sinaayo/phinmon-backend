"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
    };
};
exports.default = config;
