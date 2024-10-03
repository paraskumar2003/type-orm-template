import { NextFunction, Request, Response } from "express";
import { BaseController, DerivedClassResponse } from "..";
import { Checklist, checklistInput } from "../../entity/mongo/checklists";
import { HelperFunctions } from "../../lib";
import { HelperProcess } from "../../lib/process";

class CheckListController extends BaseController {

    constructor(protected req: Request, protected res: Response, protected next: NextFunction) {
        super(req, res, next);
    }

    async createCheckLists() {

        return this.executeSafely(async (): Promise<DerivedClassResponse> => {

            const { room, room_user_id } = this.req.room_user;

            const { name, filterArray } = this.req.body;

            // Ensure that the required fields are provided
            if (!name || !filterArray || !Array.isArray(filterArray)) {
                return {
                    statusCode: 400,
                    success: false,
                    message: "Invalid input, please provide name and filterArray.",
                    data: null,
                    error: { message: "Invalid input, please provide name and filterArray." }
                };
            }

            // Construct the checklist data
            const checklistData: checklistInput = {
                checklist_id: HelperFunctions.generateUID(),
                checklist_name: name,
                room_id: room,  // Ideally, this would come from the request (dynamic)
                created_by: room_user_id,  // Ideally, this would come from the user or token (dynamic)
                filterArray: filterArray.map((filter: any) => ({
                    name: filter.name,
                    filterType: filter.filterType,
                    value: filter.value,
                })),
                status: "active",  // Default status (can also come from the request)
            };

            // Create a new checklist entry in the database
            const newChecklist = await Checklist.create(checklistData);

            let guestList = await HelperProcess.ResolveGuestList(checklistData, filterArray);

            await HelperProcess.CreateTasksForFilteredGuests(guestList, newChecklist);

            return {
                success: true,
                message: "Checklists created successfully",
                data: {
                    checklist: newChecklist
                },
                error: null,
                statusCode: 200
            }

        })
    }

}

export { CheckListController };