import mongoose, { Schema, Model, Document } from "mongoose";
import { users_document } from "./users";
import { room_document } from "./rooms";

// Define the RoomUser document type
type room_user_document = Document & {
    room_user_id: number;
    user: users_document["user_id"]; // Reference to User
    room: room_document["room_id"]; // Reference to Room
    role: string;
    assigned_at: Date;
    assigned_by: users_document["_id"]; // Reference to User
    status: "active" | "inactive"; // Enum for status
};

// Define the RoomUser input type
type room_userInput = {
    room_user_id: number;
    user: users_document["user_id"];
    room: room_document["room_id"];
    role: string;
    assigned_by: users_document["user_id"];
    status: "active" | "inactive";
};

enum RoomUserStatus {
    active = "active",
    inactive = "inactive"
}

enum RoomUserRoles {
    SuperAdmin = "SuperAdmin",
    Admin = "Admin",
    CoOrdinator = "CoOrdinator",
    Observer = "Observer"
}

// Create the RoomUser schema
const roomUserSchema = new Schema({
    room_user_id: {
        type: Schema.Types.String,
        required: true,
        index: true,
    },
    user: {
        type: Schema.Types.String,
        ref: "users", // Reference to the User collection
        required: true,
    },
    room: {
        type: Schema.Types.String,
        ref: "rooms", // Reference to the Room collection
        required: true,
    },
    role: {
        type: Schema.Types.String,
        enum: ["SuperAdmin", "Admin", "CoOrdinator", "Observer"],
        required: true,
    },
    assigned_at: {
        type: Schema.Types.Date,
        required: true,
        default: Date.now
    },
    assigned_by: {
        type: Schema.Types.String,
        ref: "users", // Reference to the User collection for who assigned the role
        required: true,
    },
    status: {
        type: Schema.Types.String,
        enum: ["active", "inactive"], // Enum values
        required: true,
    },
}, {
    collection: "room_users",
    timestamps: {
        createdAt: 'created_at',  // Use `created_at` instead of `createdAt`
        updatedAt: 'updated_at'   // Use `updated_at` instead of `updatedAt`
    }
});

// Create the RoomUser model
const RoomUser: Model<room_user_document> = mongoose.model<room_user_document>('room_users', roomUserSchema);

export { RoomUser, room_userInput, room_user_document, RoomUserStatus, RoomUserRoles };
