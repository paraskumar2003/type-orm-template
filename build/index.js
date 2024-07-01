"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//  config for environment variables
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Connect MySQL database
const ormconfig_1 = require("./connect/ormconfig");
// Connect MongoDb Database
// import { connect } from './connect/mongoose';
// Router
const routes_1 = __importDefault(require("./routes"));
// this enables parsing json data from the req.body;
const body_parser_1 = __importDefault(require("body-parser"));
// this helps in the documentation of the apis
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerOptions_1 = require("./swagger/swaggerOptions");
//  this helps in monitoring the resource usage of the your application.
const statusMonitor = require('express-status-monitor')();
// declaring the express server
const app = (0, express_1.default)();
// adding the resource monitor
app.use(statusMonitor); // see monitoring at :- http://localhost:4000/status
const option = {
    extended: true,
    limit: "5mb" // maximum size of data that can be parsed
};
app.use(body_parser_1.default.json(option));
app.use(body_parser_1.default.urlencoded(option));
// configuration added for port
const PORT = process.env.PORT || 4000;
//connect mysql
(0, ormconfig_1.connectMySql)();
//connect mongo
// connect();
// create a middleware to log every request and response.
app.use("/api", routes_1.default);
// adding a route for swagger documentation
const specs = (0, swagger_jsdoc_1.default)(swaggerOptions_1.options);
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
app.use("/", (req, res) => {
    console.log(req.body);
    res.send(`This is the most advance node server`);
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// Import the 'http' module to create an HTTP server
const http = require("http");
// Declare a server variable of type 'any' and create an HTTP server with 'app' as the request handler
let server = http.createServer(app);
// Listen for unhandled promise rejections and handle them
process.on("unhandledRejection", (err) => {
    // Log the error
    console.log(err);
    // Log a message indicating an unhandled rejection occurred and that the server will shut down
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    // Close the server gracefully
    server.close(() => {
        // Exit the process with a failure code (1)
        process.exit(1);
    });
});
// Listen for SIGTERM signals and handle them
process.on("SIGTERM", (err) => {
    // Log the received SIGTERM signal and the associated error
    console.error(`Received SIGTERM signal - ${err}`);
    // Log a message indicating the server will shut down gracefully
    console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
    // Close the server gracefully
    server.close(() => {
        // Log a message indicating the process has terminated
        console.log("💥 Process terminated!");
    });
});
// Listen for uncaught exceptions and handle them
process.on("uncaughtException", (err) => {
    // Log the error
    console.log(err);
    // Log a message indicating an uncaught exception occurred and that the server will shut down
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    // Log the error name and message
    console.log(err.name, err.message);
    // Exit the process with a failure code (1)
    process.exit(1);
});
console.log({ environment: process.env.NODE_ENV });
//# sourceMappingURL=index.js.map