import { NextFunction, Request, Response } from "express";
import { BaseController, DerivedClassResponse } from "..";
import { RoomUser, User, users_document, UserStatus } from "../../entity/mongo";
import jwt from "jsonwebtoken";
import { HelperFunctions } from "../../lib";

let secretKey = process.env.JWT_SECRET_KEY as string;

class authController extends BaseController {

    constructor(protected req: Request, protected res: Response, next: NextFunction) {
        super(req, res, next);
    }

    async register(): Promise<void> {

        this.executeSafely(async (): Promise<DerivedClassResponse> => {

            const { username, mobile, email, password = 1234 } = this.req.body;

            // Check if the user already exists
            const existingUser = await User.findOne({ mobile });

            if (existingUser) {
                return {
                    statusCode: 409,
                    success: false,
                    message: "User already exists",
                    data: null,
                    error: {
                        message: "Mobile number already exists. Kindly Login"
                    }
                }
            }


            // Register the new user
            const newUser = new User({
                user_id: HelperFunctions.generateUID(),
                username,
                mobile,
                ...(email ? { email } : {}),
                ...(password ? { password } : {}),
            });

            await newUser.save();

            let accessToken = jwt.sign({ username, mobile, user_id: newUser.user_id }, secretKey);

            return {
                statusCode: 200,
                success: true,
                message: 'User registered successfully',
                data: { user: newUser, accessToken },
                error: null
            }
        });
    }


    async login(): Promise<void> {

        this.executeSafely(async (): Promise<DerivedClassResponse> => {

            const { mobile, password } = this.req.body;

            const user = await User.findOne({ mobile });

            if (!user) {

                return {
                    statusCode: 409,
                    success: false,
                    message: "No user exist with this mobile number. Kindly register",
                    data: null,
                    error: null
                }
            }

            if (user.password === password) {

                let accessToken = jwt.sign({ username: user.username, mobile: user.mobile, user_id: user.user_id }, secretKey);

                return {
                    statusCode: 200,
                    success: true,
                    message: 'User logged in successfully',
                    data: {
                        user: user,
                        accessToken
                    },
                    error: null
                }
            } else {
                return {
                    statusCode: 400,
                    success: false,
                    message: 'Invalid password',
                    data: null,
                    error: {
                        message: 'Invalid password',
                    }
                }
            }


        })
    }

    async acceptInvite(): Promise<void> {

        this.executeSafely(async (): Promise<DerivedClassResponse> => {

            const { room_user_id } = this.req.params;

            console.log(room_user_id);

            if (!room_user_id) {
                return {
                    success: false,
                    message: "Invalid url",
                    statusCode: 400,
                    data: null,
                    error: {
                        message: "Invalid url"
                    }
                }
            } else {

                let room_user = await RoomUser.findOne({ room_user_id }).populate({
                    path: "user",
                    model: "users",
                    localField: "user",
                    foreignField: "user_id",
                    select: "username mobile password"
                }).populate({
                    path: "room",
                    model: "rooms",
                    localField: "room",
                    foreignField: "room_id",
                    select: "room_name"
                }).populate({
                    path: "assigned_by",
                    model: "users",
                    localField: "assigned_by",
                    foreignField: "user_id",
                    select: "username mobile"
                });

                if (!room_user) {
                    return {
                        success: true,
                        message: "Invalid invitation url. Please login or register",
                        statusCode: 400,
                        data: null,
                        error: {
                            message: "Invalid invitation url. Please login or register",
                        }
                    }
                } else {
                    let { username, mobile, password, user_id } = room_user.user as Partial<users_document>;

                    if (password) {

                        let accessToken = jwt.sign({ username, mobile, user_id, room_id: room_user.room, room_user_id: room_user.room_user_id }, process.env.JWT_SECRET_KEY as string);

                        return {
                            success: true,
                            statusCode: 200,
                            message: `Room:- ${room_user.room}, Check In Successful.`,
                            data: { accessToken, room_user },
                            error: null
                        }

                    } else {
                        return {
                            success: true,
                            statusCode: 200,
                            message: `Please create password for yourself.`,
                            data: { room_user },
                            error: null
                        }
                    }

                }

            }
        })
    }


    async acceptInviteWithPassword(): Promise<void> {

        this.executeSafely(async (): Promise<DerivedClassResponse> => {

            const { room_user_id } = this.req.params;
            const { password, mobile } = this.req.body;

            let room_user = await RoomUser.findOne({ room_user_id }).populate({
                path: "user",
                model: "users",
                localField: "user",
                foreignField: "user_id",
                select: "username mobile"
            });

            if (!room_user) {
                return {
                    success: false,
                    message: "No such user found for this room",
                    data: null,
                    error: {
                        message: "No such user found for this room",
                    },
                    statusCode: 400
                }
            }

            const user = await User.findOne({ mobile, status: UserStatus.active });

            if (!user) {
                return {
                    success: false,
                    message: "No such user registered in the system",
                    statusCode: 409,
                    data: null,
                    error: {
                        message: "No such user registered in the system",
                    }
                }
            } else {

                if (user.status !== UserStatus.active) {
                    return {
                        statusCode: 401,
                        message: "Unauthorized",
                        success: false,
                        data: null,
                        error: {
                            message: "Unauthorized",
                        }
                    }
                } else {

                    if (user.password) {
                        return {
                            success: false,
                            statusCode: 409,
                            message: "Password already exists for this user.",
                            data: { room_user, user },
                            error: {
                                message: "Password already exists for this user"
                            }
                        }
                    } else {

                        await User.updateOne({ user_id: user.user_id }, { password: password });

                        let accessToken = jwt.sign({
                            username: user.username,
                            mobile: user.mobile,
                            user_id: user.user_id,
                            room_id: room_user.room,
                            room_user_id: room_user.room_user_id
                        }, process.env.JWT_SECRET_KEY as string);

                        return {
                            success: true,
                            statusCode: 200,
                            message: "Password updated ! Welcome to Wedsa",
                            data: { room_user, accessToken },
                            error: null
                        }

                    }

                }
            }

        })
    }


}

export { authController };
