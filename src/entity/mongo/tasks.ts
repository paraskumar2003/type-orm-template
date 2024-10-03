import mongoose, { Schema, Document, Model } from "mongoose";
import { guests_document } from "./guests"; // Assuming Guest model exists
import { room_user_document } from "./room_users"; // Assuming RoomUser model exists
import { checklist_document } from "./checklists";
import { room_document } from "./rooms";

// Define Task Document Interface
interface TaskDocument extends Document {
    task_id: string;
    checklist_id: checklist_document["_id"]; // Reference to Checklist
    guest_id: guests_document["_id"]; // Reference to Guest
    room_id: room_document["_id"]; // Reference to Room
    mobile: string;
    status: string;
    updateHistory: {
        changed_to: { [key: string]: any }; // Dynamic object with key-value pairs
        changed_by: room_user_document["_id"]; // Reference to RoomUser
        changed_at: Date; // Timestamp
    }[];
    created_at?: Date;
    updated_at?: Date;
}

// Task Input Type (for API input validation)
type TaskInput = {
    task_id: string;
    checklist_id: checklist_document["_id"];
    guest_id: guests_document["_id"];
    room_id: room_document["_id"];
    mobile: string;
    status: string;
    updateHistory?: {
        changed_to: { [key: string]: any }; // Dynamic object with key-value pairs
        changed_by: room_user_document["_id"];
        changed_at: Date;
    }[];
};

// Define Task Schema
const taskSchema = new Schema<TaskDocument>(
    {
        task_id: {
            type: Schema.Types.String,
            required: true,
            index: true,
        },
        checklist_id: {
            type: Schema.Types.String,
            ref: "checklist", // Reference to Checklist collection
            required: true,
        },
        guest_id: {
            type: Schema.Types.String,
            ref: "guests", // Reference to Guest collection
            required: true,
        },
        room_id: {
            type: Schema.Types.String,
            ref: "rooms", // Reference to Guest collection
            required: true,
        },
        mobile: {
            type: Schema.Types.String,
            required: true,
        },
        status: {
            type: Schema.Types.String,
            enum: ["pending", "completed", "in_progress", "cancelled"], // Define allowed status values
            default: "pending",
        },
        updateHistory: [
            {
                changed_to: {
                    type: Schema.Types.Mixed, // Allow for dynamic key-value pairs
                    required: true,
                },
                changed_by: {
                    type: Schema.Types.ObjectId,
                    ref: "room_users", // Reference to RoomUser collection
                    required: true,
                },
                changed_at: {
                    type: Schema.Types.Date,
                    default: Date.now,
                    required: true,
                },
            },
        ],
    },
    {
        collection: "tasks",
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

// Create and export the Task model
const Task: Model<TaskDocument> = mongoose.model<TaskDocument>("Task", taskSchema);

export { Task, TaskInput, TaskDocument };
