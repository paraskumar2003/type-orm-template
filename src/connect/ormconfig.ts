import { Otp, User } from "../entity/mysql";
import { DataSource } from "typeorm";
export const connectMySql = async () => {

    try {

        const connectDb = new DataSource({
            type: "mysql",
            host: process.env.NODE_ENV === "production" ? process.env.DB_PROD_HOST : process.env.DB_HOST,
            username: process.env.NODE_ENV === "production" ? process.env.DB_PROD_USER : process.env.DB_USER,
            password: process.env.NODE_ENV === "production" ? process.env.DB_PROD_PASSWORD : process.env.DB_PASSWORD,
            port: 3306,
            database: process.env.NODE_ENV === "production" ? process.env.DB_PROD_NAME : process.env.DB_NAME,
            logging: false,
            synchronize: true,
            entities: [
                User,
                Otp,
            ],
        })

        const connection: any = await connectDb.initialize();
        console.log("MySql connected successfully", `${connection.options.username}@${connection.options.host}`);

        return connectDb;

    } catch (err) {
        console.log("Error while connecting database", err.message);
        return null;
    }
}
