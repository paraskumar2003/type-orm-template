import { NextFunction, Request, Response } from "express";
import { BaseController, DerivedClassResponse } from "..";
import { Room, RoomUser, RoomUserRoles, RoomUserStatus, User, UserStatus } from "../../entity/mongo";
import { HelperFunctions } from "../../lib";

class UsersController extends BaseController {

    constructor(protected req: Request, protected res: Response, next: NextFunction) {
        super(req, res, next);
    }

    async createUser(): Promise<void> {
        this.executeSafely(async (): Promise<DerivedClassResponse> => {

            const { username, mobile, role } = this.req.body;

            if (this.req.room_user.role === RoomUserRoles.Admin && ["SuperAdmin"].includes(role)) {
                return { statusCode: 403, success: false, message: "Permission Denied", data: null, error: { message: "You don't have permission to perform this action" } }
            }

            if (this.req.room_user.role === RoomUserRoles.CoOrdinator && ["SuperAdmin", "Admin"].includes(role)) {
                return { statusCode: 403, success: false, message: "Permission Denied", data: null, error: { message: "You don't have permission to perform this action" } }
            }

            if (this.req.room_user.role === RoomUserRoles.Observer && ["SuperAdmin", "Admin", "Coordinator"].includes(role)) {
                return { statusCode: 403, success: false, message: "Permission Denied", data: null, error: { message: "You don't have permission to perform this action" } }
            }

            let user = await User.findOne({ mobile });

            if (!user) {
                user = await User.create({
                    user_id: HelperFunctions.generateUID(),
                    username,
                    mobile,
                    status: UserStatus.active,
                })
            }

            let room = await Room.findOne({
                room_id: this.req.room_user.room
            });

            if (!room) {
                return {
                    statusCode: 409,
                    success: false,
                    message: "No such room found!",
                    data: null,
                    error: null
                }
            }

            let room_user = await RoomUser.findOne({
                user: user.user_id,
                room: this.req.room_user.room
            })

            if (room_user) {

                return {
                    success: false,
                    statusCode: 400,
                    message: `This user is already a part of this room`,
                    data: { room_user },
                    error: null
                }
            } else {

                room_user = await RoomUser.create({
                    room_user_id: HelperFunctions.generateUID(),
                    user: user.user_id,
                    room: this.req.room_user.room,
                    role: role === "SuperAdmin"
                        ?
                        RoomUserRoles.SuperAdmin
                        : role === "Admin"
                            ?
                            RoomUserRoles.Admin
                            : role === "Coordinator"
                                ?
                                RoomUserRoles.CoOrdinator
                                : RoomUserRoles.Observer,
                    assigned_by: this.req.user.user_id,
                    status: RoomUserStatus.active
                })

                return {
                    success: true,
                    statusCode: 200,
                    message: "Room User Created Successfully",
                    data: { room_user },
                    error: null
                }
            }

        })
    }

    async fetchUserList(): Promise<void> {
        this.executeSafely(async (): Promise<DerivedClassResponse> => {

            let room_users = await RoomUser.find(
                {
                    // status: RoomStatus.active,
                    room: this.req.room_user.room
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

            if (room_users.length > 0) {
                return { statusCode: 200, success: true, message: "User List fetched successfully", data: { room_users }, error: null }
            } else {
                return { statusCode: 200, success: true, message: "No room users found", data: { room_users }, error: null }
            }

        })
    }

}

export { UsersController };