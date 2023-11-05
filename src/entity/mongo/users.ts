
import mongoose, { Schema, Model, Document } from "mongoose";

type users_document = Document & {
    user_id: number;
    username: string;
    email: string;
    mobile: string;
    password: string;
};

type usersInput = {
    user_id?: number;
    username: string;
    email: string;
    mobile: string;
    password: string;
};

const userSchema = new Schema({
    user_id: {
        type: Schema.Types.Number,
        required: true,
        index: true,
    },
    username: {
        type: Schema.Types.String,
        required: true,
    },
    email: {
        type: Schema.Types.String,
        required: true,
    },
    mobile: {
        type: Schema.Types.String,
        required: true,
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
}, { collection: "users", timestamps: true });

const user: Model<users_document> = mongoose.model<users_document>('users', userSchema);

export { user, usersInput, users_document };

// if u require any functions for global configuration, you can create here


export const userCreate = async (
    user_id: number,
    username: string,
    email: string,
    mobile: string,
    password: string,

) => {
    try {
        const newUser = await user.create({ user_id, username, email, mobile, password });

        console.log({ newUser });
        return newUser;
    } catch (err) {
        return err.message;
    }
}


