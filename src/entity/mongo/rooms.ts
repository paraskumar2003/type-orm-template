import mongoose, { Schema, Model, Document } from "mongoose";
import { users_document } from "./users";


// Define the Room document type
type room_document = Document & {
    room_id: number;
    room_code: string;
    created_by: users_document["_id"]; // Reference to User
    created_at: Date;
    status: "active" | "inactive" | "closed"; // Enum for status
};

// Define the Room input type
type roomInput = {
    room_id: number;
    room_code: string;
    created_by: users_document["_id"];
    status: "active" | "inactive" | "closed";
};

// Create the Room schema
const roomSchema = new Schema({
    room_id: {
        type: Schema.Types.Number,
        required: true,
        index: true,
    },
    room_code: {
        type: Schema.Types.String,
        required: true,
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: "users", // Reference to the User collection
        required: true,
    },
    created_at: {
        type: Schema.Types.Date,
        default: Date.now, // Automatically set the timestamp
    },
    status: {
        type: Schema.Types.String,
        enum: ["active", "inactive", "closed"], // Enum values
        required: true,
    },
}, { collection: "rooms", timestamps: false }); // No need for automatic timestamps

// Create the Room model
const room: Model<room_document> = mongoose.model<room_document>('rooms', roomSchema);

export { room, roomInput, room_document };
