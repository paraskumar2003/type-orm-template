import { NextFunction, Request, Response } from "express";
import { BaseController, DerivedClassResponse } from "..";

class authController extends BaseController {

    constructor(protected req: Request, protected res: Response, next: NextFunction) {
        super(req, res, next);
    }

    async sendOtp(): Promise<void> {

        this.executeSafely(async (): Promise<DerivedClassResponse> => {

            return {
                success: true,
                statusCode: 200,
                message: "OTP sent successfully!",
                data: null,
                error: null
            }
        })

    }

    async verifyOtp(): Promise<void> {

        this.executeSafely(async (): Promise<DerivedClassResponse> => {

            return {
                success: true,
                statusCode: 200,
                message: "OTP verified successfully!",
                data: {
                    user: {
                        mobile: "8445840329"
                    },
                    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.8TLPbKjmE0uGLQyLnfHx2z-zy6G8qu5zFFXRSuJID_Y"
                },
                error: null
            }
        })

    }


}

export { authController };
