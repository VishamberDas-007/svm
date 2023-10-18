"use strict";
// import { config } from "dotenv";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = __importDefault(require("./server"));
const const_1 = require("./config/const");
// import listEndpoints from 'express-list-endpoints'
console.log(process.env.DATABASE_URL);
const publicPath = express_1.default.static('public');
const app = (0, express_1.default)();
app.use('/public', publicPath);
new server_1.default(app);
// console.log(listEndpoints(app))
app.listen(const_1.PORT, () => {
    console.log(`server is running on port ${const_1.PORT}`);
});
