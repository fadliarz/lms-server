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
const errorMiddleware_1 = __importDefault(require("./middlewares/errorMiddleware"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
class App {
    /**
     *
     * @param Apis
     * @param port
     */
    constructor(Apis, port) {
        this.express = (0, express_1.default)();
        this.port = port;
        // this.httpsServer = http.createServer(
        //   {
        //     key: process.env.SSL_KEY,
        //     cert: process.env.SSL_CERT,
        //   },
        //   this.express,
        // );
        this.initialiseMiddlewares();
        this.initialiseApi(Apis);
        this.initialiseErrorHandling();
        this.setupSwagger(...Apis.map((api) => api.router));
    }
    /**
     * Swagger
     *
     */
    setupSwagger(...args) {
        const pathToSwaggerUi = require("swagger-ui-dist").absolutePath();
        this.express.use(express_1.default.static(pathToSwaggerUi));
        const options = {
            definition: {
                openapi: "3.0.0",
                info: {
                    title: "Library API",
                    version: "1.0.0",
                    description: "A simple Express Library API",
                    termsOfService: "http://example.com/terms/",
                    contact: {
                        name: "API Support",
                        url: "http://www.exmaple.com/support",
                        email: "support@example.com",
                    },
                },
                servers: [
                    {
                        url: "https://nodejs-swagger-api.vercel.app/",
                        description: "My API Documentation",
                    },
                ],
            },
            // This is to call all the file
            apis: ["src/**/*.js"],
        };
        const specs = (0, swagger_jsdoc_1.default)(options);
        this.express.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs, {
            customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css",
        }));
        // console.log(path.join(process.cwd(), "swagger.yaml"));
        //
        // this.express.use(
        //   "/api-docs",
        //   swaggerUi.serve,
        //   swaggerUi.setup(yaml.load(path.join(process.cwd(), "swagger.yaml")), {
        //     customCssUrl:
        //       "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css",
        //   }),
        // );
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
}
exports.default = App;
