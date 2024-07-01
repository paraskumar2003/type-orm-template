"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMySql = void 0;
const mysql_1 = require("../entity/mysql");
const typeorm_1 = require("typeorm");
const connectMySql = async () => {
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
                mysql_1.User,
                mysql_1.Otp,
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
exports.connectMySql = connectMySql;
//# sourceMappingURL=ormconfig.js.map