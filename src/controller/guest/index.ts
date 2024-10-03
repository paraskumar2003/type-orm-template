import { NextFunction, Request, Response } from "express";
import { BaseController, DerivedClassResponse } from "..";
import { Guest } from "../../entity/mongo";
import { HelperFunctions } from "../../lib";
import { Task } from "../../entity/mongo/tasks";


class GuestController extends BaseController {

    constructor(
        protected req: Request,
        protected res: Response,
        protected next: NextFunction
    ) {
        super(req, res, next);
    }

    async uploadCsvFile() {
        return this.executeSafely(async (): Promise<DerivedClassResponse> => {
            try {
                // Extract parsedCsv from the request body
                let { parsedCsv } = this.req;

                // Extract room_user_id and room_id from the request

                console.log(this.req.room_user);

                let { room_user_id, room } = this.req.room_user;

                if (!parsedCsv || parsedCsv.length === 0) {
                    return {
                        success: false,
                        message: "No CSV data found",
                        data: null,
                        error: null,
                        statusCode: 400
                    };
                }

                await Task.deleteMany({ room_id: room });

                await Guest.updateMany({ room_id: room }, { status: 2 });

                // Prepare the guests data to save
                const guests = parsedCsv.map((row: any) => {
                    // Extract necessary fields
                    const { name, mobile, category, ...other_attributes } = row;

                    return {
                        guest_id: HelperFunctions.generateUID(), // Generate new ObjectID
                        room_id: room,
                        created_by: room_user_id,
                        name: name || "", // Default to empty string if name is missing
                        mobile: mobile || "", // Default to empty string if mobile is missing
                        category: category || "", // Default to empty string if category is missing
                        other_attributes: other_attributes || {}, // Store remaining fields as JSON
                    };
                });

                // Bulk insert into the Guest model
                await Guest.insertMany(guests);

                return {
                    success: true,
                    message: `${guests.length} guests successfully uploaded`,
                    data: guests,
                    error: null,
                    statusCode: 201
                };
            } catch (error) {
                console.error("Error uploading CSV:", error);
                return {
                    success: false,
                    message: "Failed to upload CSV",
                    data: null,
                    error: error.message,
                    statusCode: 500
                };
            }
        });
    }

    async downloadCsvFile() {
        return this.executeSafely(async (): Promise<any> => {
            try {
                // Define the CSV headers
                const headers = 'name,mobile,category\n';

                // Set headers to trigger a CSV file download
                this.res.header('Content-Type', 'text/csv');
                this.res.attachment('guests.csv');

                // Write the CSV content (only headers) to the response
                this.res.write(headers);
                this.res.end(); // End the response

                return;
            } catch (error) {
                console.error("Error generating CSV:", error);
                return {
                    success: false,
                    message: "Something went wrong",
                    data: null,
                    error: {
                        message: error.message
                    },
                    statusCode: 500
                };
            }
        });
    }


    async fetchGuestList() {
        return this.executeSafely(async (): Promise<DerivedClassResponse> => {


            const guest_list = await Guest.aggregate([
                {
                    $match: {
                        room_id: this.req.room_user.room
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
            ]);

            console.log(guest_list);

            return {
                statusCode: 200,
                success: true,
                message: "Guest list fetched successfully",
                data: {
                    guest_list
                },
                error: null
            }
        })
    }




}

export { GuestController };