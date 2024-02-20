"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const errorMiddleware_1 = __importDefault(require("./middlewares/errorMiddleware"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const PrismaClientSingleton_1 = __importDefault(require("./common/class/PrismaClientSingleton"));
const yamljs_1 = __importDefault(require("yamljs"));
const https_1 = __importDefault(require("https"));
class App {
    /**
     *
     * @param Apis
     * @param port
     */
    constructor(Apis, port) {
        this.prisma = PrismaClientSingleton_1.default.getInstance();
        this.express = (0, express_1.default)();
        this.port = port;
        this.httpsServer = https_1.default.createServer(
        // {
        //   key: process.env.SSL_KEY,
        //   cert: process.env.SSL_CERT,
        // },
        this.express);
        this.initialiseMiddlewares();
        this.initialiseApi(Apis);
        this.initialiseErrorHandling();
        // this.setupSwagger(...Apis.map((api) => api.router));
        this.setup();
    }
    /**
     * Swagger
     *
     */
    setupSwagger(...args) {
        this.express.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(yamljs_1.default.load("swagger.yaml")));
    }
    /**
     * Listen to app to a port
     *
     */
    listen() {
        let port = process.env.NODE_ENV == "test"
            ? Math.floor(Math.random() * 60000) + 5000
            : this.port;
        this.httpsServer.listen(port, () => {
            console.log("HTTPS server is listening on the port", port);
        });
    }
    /**
     * Middlewares
     *
     */
    initialiseMiddlewares() {
        this.express.use((0, cors_1.default)({
            origin: "http://localhost:4444",
            credentials: true, //access-control-allow-credentials:true
            optionsSuccessStatus: 200,
        }));
        if (process.env.NODE_ENV === "development") {
            this.express.use((0, morgan_1.default)("'dev"));
        }
        this.express.use((0, helmet_1.default)());
        this.express.use((0, compression_1.default)());
        this.express.use((0, cookie_parser_1.default)());
        this.express.use(express_1.default.json());
        this.express.use(express_1.default.urlencoded({ extended: true }));
        this.express.use((0, compression_1.default)());
    }
    /**
     *
     * @param Apis
     * @private
     */
    initialiseApi(Apis) {
        Apis.forEach((api) => {
            this.express.use(api.path, api.router);
        });
        this.express.use("/test", (req, res) => {
            return res.send("Success!");
        });
    }
    /**
     * Error Handling
     *
     */
    initialiseErrorHandling() {
        this.express.use(errorMiddleware_1.default);
    }
    /**
     * Make database connection
     *
     */
    initialiseDatabaseConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.prisma.$connect();
                console.log("Successfully establishing database connection!");
            }
            catch (error) {
                console.error("error: ", error);
                throw Error("Failed establishing a database connection!");
            }
        });
    }
    /**
     * Setup
     *
     */
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Initialising database connection!");
                yield this.initialiseDatabaseConnection();
                this.listen();
            }
            catch (error) {
                console.error("error: ", error);
                throw Error("Failed setting up!");
            }
        });
    }
}
exports.default = App;
