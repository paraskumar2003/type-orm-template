import ProductName from "../entity/product/productName";
import User from "../entity/user";
import { DataSource } from "typeorm";
export const connectTypeOrm = async () => {

    try {

        const connectDb = new DataSource({
            type: "mysql",
            host: "localhost",
            username: 'root',
            password: '12345678',
            port: 3306,
            database: 'typeorm',
            logging: true,
            synchronize: true,
            entities: [
                User,
                ProductName,
                "../entity/*.ts",
                "../entity/*/*.ts",
            ],

        })

        const connection: any = await connectDb.initialize();
        console.log("MySql connected successfully", `${connection.options.username}@${connection.options.host}`);



    } catch (err) {
        console.log("Error while connecting database", err.message);
    }
}

