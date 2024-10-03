import { Guest, guests_document } from "../../entity/mongo";
import { checklist_document, ChecklistFilterArray, checklistInput } from "../../entity/mongo/checklists";
import { Task } from "../../entity/mongo/tasks";
import { HelperFunctions } from "../helper";

class HelperProcess {
    static async ResolveGuestList(checklist: checklistInput, filterArray: ChecklistFilterArray) {
        try {
            // Assume checklist has some guest data that we need to filter
            let guestList: any[] = await Guest.aggregate([
                {
                    $match: {
                        room_id: checklist.room_id
                    }
                },
                {
                    $project: {
                        _id: 0, // Exclude the _id field
                        guest_id: 1,
                        room_id: 1,
                        created_by: 1,
                        name: 1,
                        mobile: 1,
                        category: 1,
                        // Merge other_attributes into the main document
                        mergedAttributes: { $mergeObjects: ["$$ROOT", "$other_attributes"] }
                    }
                },
                {
                    // Replace the root document with the mergedAttributes object
                    $replaceRoot: { newRoot: "$mergedAttributes" }
                },
                {
                    $unset: "other_attributes" // Optionally, remove the original other_attributes field
                }
            ]); // Replace this with the actual data source

            // Apply each filter in filterArray
            filterArray.forEach(filter => {
                const { name, filterType, value } = filter;

                // Filter logic based on filterType
                switch (filterType) {
                    case 'includes':
                        guestList = guestList.filter(guest => guest[name]?.includes(value));
                        break;

                    case 'excludes':
                        guestList = guestList.filter(guest => !guest[name]?.includes(value));
                        break;

                    case 'startsWith':
                        guestList = guestList.filter(guest => guest[name]?.startsWith(value));
                        break;

                    case 'endsWith':
                        guestList = guestList.filter(guest => guest[name]?.endsWith(value));
                        break;

                    case 'isEquals':
                        guestList = guestList.filter(guest => guest[name] === value);
                        break;

                    case 'notEquals':
                        guestList = guestList.filter(guest => guest[name] !== value);
                        break;

                    default:
                        break;
                }
            });

            // Return the filtered guest list
            return guestList;

        } catch (err) {
            console.error("Error resolving guest list:", err);
            throw new Error("Failed to resolve guest list.");
        }
    }

    static async CreateTasksForFilteredGuests(guestList: guests_document[], checklist: checklist_document) {
        try {

            // Iterate through the filtered guest list and create tasks for each guest
            const tasks = guestList.map(guest => ({
                task_id: HelperFunctions.generateUID(), // Generate unique task_id
                checklist_id: checklist.checklist_id, // Reference the checklist
                room_id: checklist.room_id,
                guest_id: guest.guest_id, // Reference the guest
                mobile: guest.mobile, // Guest's mobile number
                status: "pending", // Default task status
                created_at: new Date(), // Current timestamp
                updated_at: new Date(),
                updateHistory: [], // Initialize an empty update history
            }));

            // Save all tasks in the database
            const createdTasks = await Task.insertMany(tasks);
            return createdTasks;
        } catch (err) {
            console.error("Error creating tasks for filtered guests:", err);
            throw new Error("Failed to create tasks.");
        }
    }
}

export { HelperProcess };