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



    // database.once('open', async () => {

    //     console.log('Connected to database successfully');

    // });



    // database.on('error', () => {

    //     console.log(`Error connecting to database. Check Whether mongoDB

    //     installed or you can try to give opensource Mongo Atlas database`);

    // });



    return {

        // User, Otp, Admin

    };

};



export const disconnect = () => {

    if (!database) {

        return;

    }

    Mongoose.disconnect();

};