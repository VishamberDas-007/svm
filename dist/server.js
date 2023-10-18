"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./routes");
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorHandler_1 = __importDefault(require("./utils/errorHandler"));
class Server {
    constructor(app) {
        this.config(app);
    }
    config(app) {
        app.use((0, express_1.urlencoded)({ extended: true }));
        app.use((0, morgan_1.default)('dev'));
        app.use((0, express_1.json)());
        app.use((0, cookie_parser_1.default)());
        app.use((0, cors_1.default)());
        // test()
        app.use('/api', routes_1.mainRouter);
        app.use('/*', (req, res) => {
            return res.status(404).send({
                message: 'Route not found',
            });
        });
        app.use(errorHandler_1.default);
    }
}
exports.default = Server;
