"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errrorMiddleware_1 = __importDefault(require("./middlewares/errrorMiddleware"));
class App {
    /**
     *
     * @param controllers
     * @param port
     */
    constructor(Apis, port) {
        this._express = (0, express_1.default)();
        this._port = port;
        this.initialiseMiddlewares();
        this.initialiseApi(Apis);
        this.initialiseErrorHandling();
        this.initialiseDatabaseConnection();
    }
    /**
     * Middlewares
     */
    initialiseMiddlewares() {
        this._express.use((0, cors_1.default)());
        this._express.use((0, morgan_1.default)('"dev'));
        this._express.use((0, helmet_1.default)());
        this._express.use((0, compression_1.default)());
        this._express.use((0, cookie_parser_1.default)());
        this._express.use(express_1.default.json());
        this._express.use(express_1.default.urlencoded({ extended: true }));
        this._express.use((0, compression_1.default)());
    }
    /**
     *
     * @param controllers
     */
    initialiseApi(Apis) {
        Apis.forEach((api) => {
            this._express.use(api.path, api.router);
        });
    }
    /**
     * Error Handling
     */
    initialiseErrorHandling() {
        this._express.use(errrorMiddleware_1.default);
    }
    /**
     * Make database connection
     */
    initialiseDatabaseConnection() { }
    /**
     * Listen to app to a port
     */
    listen() {
        this._express.listen(this._port, () => {
            console.log(`App is listening on the port ${this._port}`);
        });
    }
}
exports.default = App;
