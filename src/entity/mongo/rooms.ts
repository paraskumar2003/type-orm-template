import mongoose, { Schema, Model, Document } from "mongoose";
import { users_document } from "./users";


// Define the Room document type
type room_document = Document & {
    room_id: number;
    room_name: string;
    created_by: users_document["user_id"]; // Reference to User
    created_at: Date;
    status: "active" | "inactive" | "closed"; // Enum for status
};

// Define the Room input type
type roomInput = {
    room_id: number;
    room_name: string;
    created_by: users_document["user_id"];
    status: "active" | "inactive" | "closed";
};

enum RoomStatus {
    active = "active",
    inactive = "inactive",
    closed = "closed"
}

// Create the Room schema
const roomSchema = new Schema({
    room_id: {
        type: Schema.Types.String,
        required: true,
        index: true,
    },
    room_name: {
        type: Schema.Types.String,
        required: true,
    },
    room_pin: {
        type: Schema.Types.String,
        required: false
    },
    created_by: {
        type: Schema.Types.String,
        ref: "users", // Reference to the User collection
        required: true,
    },
    status: {
        type: Schema.Types.String,
        enum: ["active", "inactive", "closed"], // Enum values
        required: true,
    },
}, {
    collection: "rooms",
    timestamps: {
        createdAt: 'created_at',  // Use `created_at` instead of `createdAt`
        updatedAt: 'updated_at'   // Use `updated_at` instead of `updatedAt`
    }
});

// Create the Room model
const Room: Model<room_document> = mongoose.model<room_document>('rooms', roomSchema);

export { Room, roomInput, room_document, RoomStatus };
