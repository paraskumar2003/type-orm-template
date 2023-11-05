"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ormconfig_1 = require("./connect/ormconfig");
const mongoose_1 = require("./connect/mongoose");
const routes_1 = __importDefault(require("./routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const http = require("http");
const app = (0, express_1.default)();
const option = { extended: true, limit: "5mb" };
app.use(body_parser_1.default.json(option));
app.use(body_parser_1.default.urlencoded(option));
const PORT = process.env.PORT || 4000;
(0, ormconfig_1.connectTypeOrm)();
(0, mongoose_1.connect)();
const saveARec = async () => {
};
saveARec();
app.use("/api", routes_1.default);
app.use("/", (req, res) => {
    console.log(req.body);
    res.send(`This is the most advance node server`);
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
let server = http.createServer(app);
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
//# sourceMappingURL=index.js.map