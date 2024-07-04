import express, { Request, Response } from 'express';

//  config for environment variables
import dotenv from "dotenv";
dotenv.config();

// Connect MySQL database
import { connectMySql } from './connect/ormconfig';

// Connect MongoDb Database
// import { connect } from './connect/mongoose';

// Router
import router from './routes';

// this enables parsing json data from the req.body;
import bodyParser from 'body-parser';

// this helps in the documentation of the apis
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { options } from './swagger/swaggerOptions';

//  this helps in monitoring the resource usage of the your application.
const statusMonitor = require('express-status-monitor')();

// declaring the express server
const app = express();

// adding the resource monitor
app.use(statusMonitor); // see monitoring at :- http://localhost:4000/status


interface Option {
    extended: boolean;
    limit: string;
}

const option: Option = {
    extended: true, // true for parsing the nested json object, false for parsing the first stage only
    limit: "5mb" // maximum size of data that can be parsed
};

app.use(bodyParser.json(option));
app.use(bodyParser.urlencoded(option));

// configuration added for port
const PORT = process.env.PORT || 4000;

//connect mysql
connectMySql();

//connect mongo
// connect();

// create a middleware to log every request and response.
app.use("/api", router);

// adding a route for swagger documentation
const specs = swaggerJsDoc(options);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));


app.use("/", (req: Request, res: Response) => {
    console.log(req.body);
    res.send(`This is the most advance node server`);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Import the 'http' module to create an HTTP server
const http = require("http");

// Declare a server variable of type 'any' and create an HTTP server with 'app' as the request handler
let server: any = http.createServer(app);

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

