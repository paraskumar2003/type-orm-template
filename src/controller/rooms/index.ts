import { NextFunction, Request, Response } from "express";
import { BaseController, DerivedClassResponse } from "..";
import { Room, RoomStatus, RoomUser, RoomUserRoles, RoomUserStatus } from "../../entity/mongo";
import { HelperFunctions } from "../../lib";
import jwt from "jsonwebtoken";

class RoomsController extends BaseController {

    constructor(protected req: Request, protected res: Response, next: NextFunction) {
        super(req, res, next);
    }

    async createRoom(): Promise<void> {
        this.executeSafely(async (): Promise<DerivedClassResponse> => {

            const { room_name, room_pin } = this.req.body;

            let user = this.req.user;

            let room = await Room.findOne({ room_name });

            if (room) {

                return {
                    statusCode: 409,
                    success: false,
                    message: "Room already exists",
                    data: null,
                    error: {
                        message: "Room already exist with this room_name"
                    }
                }

            } else {

                room = await Room.create({
                    room_name: room_name,
                    room_pin: room_pin,
                    room_id: HelperFunctions.generateUID(),
                    created_by: user.user_id,
                    status: RoomStatus.active
                })

                let { room_user_id, role, status } = await RoomUser.create({
                    room_user_id: HelperFunctions.generateUID(),
                    user: user.user_id,
                    room: room.room_id,
                    role: RoomUserRoles.SuperAdmin,
                    assigned_by: user.user_id,
                    assigned_at: new Date(),
                    status: RoomUserStatus.active
                })

                return {
                    statusCode: 200,
                    success: true,
                    message: "Room Created Successfully",
                    data: {
                        room, room_user: {
                            room_user_id,
                            role,
                            status
                        }
                    },
                    error: null
                }
            }
        })
    }

    async fetchAvailableRooms(): Promise<void> {

        this.executeSafely(async (): Promise<DerivedClassResponse> => {

            let rooms = await RoomUser.find(
                {
                    // status: RoomStatus.active,
                    user: this.req.user.user_id
                },
                '-__v'
            ).populate(
                {
                    path: 'user',
                    model: 'users',
                    foreignField: 'user_id',
                    localField: 'user',
                    select: 'username mobile'
                }
            ).populate({
                path: 'assigned_by',
                model: 'users',
                foreignField: 'user_id',
                localField: 'assigned_by',
                select: 'username mobile'
            }
            ).populate(
                {
                    path: 'room',
                    model: 'rooms',
                    foreignField: 'room_id',
                    localField: 'room',
                    select: 'room_name created_at'
                }
            );

            return {
                statusCode: 200,
                success: true,
                message: "Rooms fetched successfully",
                data: {
                    rooms
                },
                error: null,

            }

        })
    }

    async checkInRoom(): Promise<void> {
        this.executeSafely(async (): Promise<DerivedClassResponse> => {

            const { room_id } = this.req.body;

            let room = await Room.findOne({ room_id });

            if (!room) {
                return {
                    success: false,
                    message: "No such room exists.",
                    data: null,
                    error: null,
                    statusCode: 400
                }
            }


            let room_user = await RoomUser.findOne({
                user: this.req.user.user_id,
                room: room_id
            });

            if (!room_user) {
                return {
                    success: false,
                    message: "You are not a participant of this room. Please contact your room owner",
                    statusCode: 400,
                    data: null,
                    error: null
                }
            }

            let { username, mobile, user_id } = this.req.user;

            let accessToken = jwt.sign({ username, mobile, user_id, room_id, room_user_id: room_user.room_user_id }, process.env.JWT_SECRET_KEY as string);

            return {
                success: true,
                statusCode: 200,
                message: `Room:- ${room.room_name}, Check In Successful.`,
                data: { accessToken, room_user },
                error: null
            }
        })
    }

}

export { RoomsController };