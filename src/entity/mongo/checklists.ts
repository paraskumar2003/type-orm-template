import mongoose, { Schema, Model, Document } from "mongoose";
import { room_document } from "./rooms";  // Assuming you have a rooms schema
import { room_user_document } from "./room_users";  // Assuming you have a room_users schema

interface ChecklistFilterItem {
    name: string;
    filterType: "includes" | "excludes" | "startsWith" | "endsWith" | "isEquals" | "notEquals";
    value: string;
}

// Now define an array of ChecklistFilterItem
interface ChecklistFilterArray extends Array<ChecklistFilterItem> { }

// Define types for checklist document
type checklist_document = Document & {
    checklist_id: string;
    checklist_name: string;
    room_id: room_document["room_id"];  // Reference to room
    created_by: room_user_document["room_user_id"];  // Reference to room_user
    filterArray: {
        name: string;
        filterType: "includes" | "excludes" | "startsWith" | "endsWith" | "isEquals" | "notEquals";
        value: string;
    }[];
    status: "active" | "inactive" | "archived";  // Assuming the possible statuses
    created_at: Date;  // Timestamp for when the checklist is created
    updated_at: Date;  // Timestamp for when the checklist is last updated
    description?: string;
};

// Define input type for checklist
type checklistInput = {
    checklist_id?: string;  // Optional in case you're generating it manually
    checklist_name: string;
    room_id: room_document["room_id"];
    created_by: room_user_document["room_user_id"];
    filterArray: {
        name: string;
        filterType: "includes" | "excludes" | "startsWith" | "endsWith" | "isEquals" | "notEquals";
        value: string;
    }[];
    status?: "active" | "inactive" | "archived";  // Optional, defaults to 'active'
    description?: string;
};

// Define the Checklist schema
const checklistSchema = new Schema(
    {
        checklist_id: {
            type: Schema.Types.String,
            required: true,
            index: true,
            unique: true,
        },
        checklist_name: {
            type: Schema.Types.String,
            required: true,
            index: true,  // Index to speed up queries based on checklist name
        },
        room_id: {
            type: Schema.Types.String,
            ref: "rooms",  // Reference to the "Room" model
            required: true,
        },
        created_by: {
            type: Schema.Types.String,
            ref: "room_users",  // Reference to the "RoomUser" model
            required: true,
        },
        filterArray: [
            {
                name: { type: Schema.Types.String, required: true },
                filterType: {
                    type: Schema.Types.String,
                    required: true,
                    enum: ["includes", "excludes", "startsWith", "endsWith", "isEquals", "notEquals"],
                },
                value: { type: Schema.Types.String, required: true },
            },
        ],
        status: {
            type: Schema.Types.String,
            enum: ["active", "inactive", "archived"],
            default: "active",  // Default status
            required: true,
        },
        description: {
            type: Schema.Types.String,
            required: false
        }
    },
    {
        collection: "checklists",
        timestamps: {
            createdAt: "created_at",  // Use `created_at` instead of `createdAt`
            updatedAt: "updated_at",  // Use `updated_at` instead of `updatedAt`
        },
    }
);

// Create and export the Checklist model
const Checklist: Model<checklist_document> = mongoose.model<checklist_document>("checklists", checklistSchema);

export { Checklist, checklistInput, checklist_document, ChecklistFilterArray };
