import express, { Request, Response } from 'express';
import dotenv from "dotenv";
dotenv.config();
import { connectTypeOrm } from './connect/ormconfig';
// import { connect } from './connect/mongoose';
import router from './routes';
import bodyParser from 'body-parser';
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { options } from './swagger/swaggerOptions';


const http = require("http");

const app = express();
const option: any = { extended: true, limit: "5mb" };
app.use(bodyParser.json(option));
app.use(bodyParser.urlencoded(option));
const PORT = process.env.PORT || 4000;

//connect mysql
connectTypeOrm();

//connect mongo
// connect();


const specs = swaggerJsDoc(options);


app.use("/api", router);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));



app.use("/", (req: Request, res: Response) => {
    console.log(req.body);
    res.send(`This is the most advance node server`);
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

let server: any = http.createServer(app);

process.on("unhandledRejection", (err) => {
    console.log(err);
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    server.close(() => {
        process.exit(1);
    });
});

process.on("SIGTERM", (err) => {
    console.error(`Received SIGTERM signal - ${err}`);
    console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
    server.close(() => {
        console.log("💥 Process terminated!");
    });
});

process.on("uncaughtException", (err) => {
    console.log(err);
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});


console.log({ environment: process.env.NODE_ENV });