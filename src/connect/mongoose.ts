import * as Mongoose from 'mongoose';
let database: Mongoose.Connection;
import dotenv from "dotenv";

dotenv.config();

export const connect = async () => {

    var uri: any;
    console.log(process.env.NODE_ENV);

    if (process.env.NODE_ENV == "production") {

        uri = process.env.DATABASE_URL;

    } else if (process.env.NODE_ENV == "development") {

        uri = process.env.MONGO_DB_URI_DEV;

    }

    if (database) {

        return;

    }

    await Mongoose.connect(uri, { writeConcern: { w: 'majority' } }).then(() => {

        console.log('MongoDb connected successfully!!');

    }).catch((err) => {

        console.log(err);

    });

    database = Mongoose.connection;
    return true;

};


export const disconnect = () => {

    if (!database) {
        return;
    }
    Mongoose.disconnect();

};