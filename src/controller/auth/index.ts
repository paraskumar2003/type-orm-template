import { NextFunction, Request, Response } from "express";
import { BaseController, DerivedClassResponse } from "..";
import { user } from "../../entity/mongo";
import jwt from "jsonwebtoken";

let secretKey = process.env.JWT_SECRET_KEY;

class authController extends BaseController {

    constructor(protected req: Request, protected res: Response, next: NextFunction) {
        super(req, res, next);
    }

    async register(): Promise<void> {

        this.executeSafely(async (): Promise<DerivedClassResponse> => {
            const { username, email, mobile, password, role, room_code } = this.req.body;

            // Check if the user already exists
            const existingUser = await user.findOne({ email });
            if (existingUser) {
                throw new Error('User already exists');
            }

            // If the role is not Super Admin or Master, check for Bearer Token and decode it
            if (role !== 'SuperAdmin' && role !== 'Master') {
                const authHeader = this.req.headers.authorization;
                if (!authHeader || !authHeader.startsWith('Bearer ')) {
                    throw new Error('Bearer token is required');
                }
                const token = authHeader.split(' ')[1];

                // Decode the token to get the user_id
                try {
                    const decoded = jwt.verify(token, secretKey as string) as { user_id: string };
                    const tokenUser = await user.findById(decoded.user_id);
                    if (!tokenUser) {
                        throw new Error('Invalid token');
                    }
                } catch (error) {
                    throw new Error('Invalid token');
                }
            }

            // Register the new user
            const newUser = new user({
                username,
                email,
                mobile,
                password,
                role,
                room_code
            });

            await newUser.save();
            return {
                statusCode: 200,
                success: true,
                message: 'User registered successfully',
                data: { user: newUser },
                error: null
            }
        });
    }
}

export default authController;
