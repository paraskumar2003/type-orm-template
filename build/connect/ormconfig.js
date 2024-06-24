"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveRec = exports.connectTypeOrm = void 0;
const user_1 = __importDefault(require("../entity/user"));
const typeorm_1 = require("typeorm");
const connectTypeOrm = async () => {
    try {
        const connectDb = new typeorm_1.DataSource({
            type: "mysql",
            host: process.env.NODE_ENV === "production" ? process.env.DB_PROD_HOST : process.env.DB_HOST,
            username: process.env.NODE_ENV === "production" ? process.env.DB_PROD_USER : process.env.DB_USER,
            password: process.env.NODE_ENV === "production" ? process.env.DB_PROD_PASSWORD : process.env.DB_PASSWORD,
            port: 3306,
            database: process.env.NODE_ENV === "production" ? process.env.DB_PROD_NAME : process.env.DB_NAME,
            logging: false,
            synchronize: true,
            entities: [
                user_1.default,
                "../entity/*.ts",
                "../entity/*/*.ts",
                // "./src/entity/*.ts",
            ],
        });
        const connection = await connectDb.initialize();
        console.log("MySql connected successfully", `${connection.options.username}@${connection.options.host}`);
        return connectDb;
        // await User.create({username:"paras",email:"email@gmail.com",mobile:"8445840329",password:"Paras&Kumar12"});
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