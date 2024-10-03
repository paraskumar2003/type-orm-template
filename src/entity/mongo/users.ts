import mongoose, { Schema, Model, Document } from "mongoose";

type users_document = Document & {
    user_id: number;
    username: string;
    email: string;
    mobile: string;
    password: string;
    status: UserStatus;
    other?: any;
};

type usersInput = {
    user_id?: number;
    username: string;
    email: string;
    mobile: string;
    password: string;
    status: UserStatus;
    other?: any;
};

enum UserStatus {
    active = "active",
    inactive = "inactive",
    blocked = "blocked"
}

const userSchema = new Schema({
    user_id: {
        type: Schema.Types.String,
        required: true,
        index: true,
    },
    username: {
        type: Schema.Types.String,
        required: true,
    },
    email: {
        type: Schema.Types.String,
        required: false,
    },
    mobile: {
        type: Schema.Types.String,
        required: true,
    },
    password: {
        type: Schema.Types.String,
        required: false,
    },
    status: {
        type: Schema.Types.String,
        enum: ["active", "inactive", "blocked"],
        default: "active",
        required: true
    },
    other: {
        type: Schema.Types.Mixed,
        required: false,
    }
}, {
    collection: "users",
    timestamps: {
        createdAt: 'created_at',  // Use `created_at` instead of `createdAt`
        updatedAt: 'updated_at'   // Use `updated_at` instead of `updatedAt`
    }
});

const User: Model<users_document> = mongoose.model<users_document>('users', userSchema);

export { User, usersInput, users_document, UserStatus };
