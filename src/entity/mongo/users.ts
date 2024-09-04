import mongoose, { Schema, Model, Document } from "mongoose";

type Role = "Master" | "SuperAdmin" | "Admin" | "CoOrdinator";

type users_document = Document & {
    user_id: number;
    username: string;
    email: string;
    mobile: string;
    password: string;
    other?: any;
    role: Role; // Add the `role` attribute
};

type usersInput = {
    user_id?: number;
    username: string;
    email: string;
    mobile: string;
    password: string;
    other?: any;
    role: Role; // Include the `role` attribute here as well
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
        required: true,
    },
    other: {
        type: Schema.Types.Mixed,
        required: false,
    },
    role: {
        type: Schema.Types.String,
        enum: ["Master", "SuperAdmin", "Admin", "CoOrdinator"], // Define the enum values
        required: true, // Make it required
    },
}, { collection: "users", timestamps: true });

const user: Model<users_document> = mongoose.model<users_document>('users', userSchema);

export { user, usersInput, users_document };
