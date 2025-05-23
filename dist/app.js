"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const config_1 = __importDefault(require("./config"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use("*", (req, res) => {
    res.status(404).send("Route Not Found");
});
(0, db_1.connectToDB)().then(() => {
    app.listen((0, config_1.default)().PORT, () => {
        console.log(`Server is running on port ${(0, config_1.default)().PORT}`);
    });
});
