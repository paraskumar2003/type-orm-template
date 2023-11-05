"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveRec = exports.connectTypeOrm = void 0;
const productName_1 = __importDefault(require("../entity/product/productName"));
const user_1 = __importDefault(require("../entity/user"));
const typeorm_1 = require("typeorm");
const connectTypeOrm = async () => {
    try {
        const connectDb = new typeorm_1.DataSource({
            type: "mysql",
            host: "localhost",
            username: 'root',
            password: '12345678',
            port: 3306,
            database: 'typeorm',
            logging: true,
            synchronize: true,
            entities: [
                user_1.default,
                productName_1.default,
                "../entity/*.ts",
                "../entity/*/*.ts",
            ],
        });
        const connection = await connectDb.initialize();
        console.log("MySql connected successfully", `${connection.options.username}@${connection.options.host}`);
        return connectDb;
    }
    catch (err) {
        console.log("Error while connecting database", err.message);
        return null;
    }
};
exports.connectTypeOrm = connectTypeOrm;
const saveRec = async () => {
    try {
    }
    catch (err) {
        return err.message;
    }
};
exports.saveRec = saveRec;
//# sourceMappingURL=ormconfig.js.map