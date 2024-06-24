import User from "../entity/user";
import { DataSource } from "typeorm";
export const connectTypeOrm = async () => {

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
                "../entity/*.ts",
                "../entity/*/*.ts",
                // "./src/entity/*.ts",
            ],

        })

        const connection: any = await connectDb.initialize();
        console.log("MySql connected successfully", `${connection.options.username}@${connection.options.host}`);

        return connectDb;

        // await User.create({username:"paras",email:"email@gmail.com",mobile:"8445840329",password:"Paras&Kumar12"});

    } catch (err) {
        console.log("Error while connecting database", err.message);
        return null;
    }
}
export const saveRec = async () => {
    try {

    } catch (err) {
        return err.message;
    }
}

