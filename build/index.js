"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ormconfig_1 = require("./connect/ormconfig");
const app = (0, express_1.default)();
(0, ormconfig_1.connectTypeOrm)();
app.listen(4000, () => { console.log("listening on 4000"); });
app.use("/", (req, res) => { console.log(req.query); res.send(200); });
//# sourceMappingURL=index.js.map