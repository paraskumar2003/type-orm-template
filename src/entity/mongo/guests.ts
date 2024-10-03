import mongoose, { Schema, Model, Document } from "mongoose";
import { room_document } from "./rooms";
import { room_user_document } from "./room_users";

// Define types for guests document and input
type guests_document = Document & {
    guest_id: string;
    room_id: room_document["room_id"]; // Reference to room
    created_by: room_user_document["room_user_id"]; // Reference to room_user
    name: string;
    mobile: string;
    category: string;
    other_attributes?: any; // To store any JSON data
};

// Define input type for guests
type guestsInput = {
    guest_id?: string;
    room_id: room_document["room_id"]; // Reference to room
    created_by: room_user_document["room_user_id"]; // Refeoom_user
    name: string;
    mobile: string;
    category: string;
    other_attributes?: any; // Optional field for JSON data
};

// Define the Guest schema
const guestSchema = new Schema(
    {
        guest_id: {
            type: Schema.Types.String,
            required: true,
            index: true,
        },
        room_id: {
            type: Schema.Types.String,
            ref: "rooms", // Reference to the "Room" model
            required: true,
        },
        created_by: {
            type: Schema.Types.String,
            ref: "room_users", // Reference to the "RoomUser" model
            required: true,
        },
        name: {
            type: Schema.Types.String,
            required: true,
        },
        mobile: {
            type: Schema.Types.String,
            required: true,
        },
        category: {
            type: Schema.Types.String,
            required: true,
        },
        invitation_status: {
            type: Schema.Types.String,
            enum: ['Pending', "Arriving", "Declined"]
        },
        status: {
            type: Schema.Types.String,
            enum: ["active", "inactive", "blocked"]
        },
        other_attributes: {
            type: Schema.Types.Mixed, // Store JSON-like data
            required: false,
        },
    },
    {
        collection: "guests",
        timestamps: {
            createdAt: "created_at", // Use `created_at` instead of `createdAt`
            updatedAt: "updated_at", // Use `updated_at` instead of `updatedAt`
        },
    }
);

// Create and export the Guest model
const Guest: Model<guests_document> = mongoose.model<guests_document>("guests", guestSchema);

export { Guest, guestsInput, guests_document };
