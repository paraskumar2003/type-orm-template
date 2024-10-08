import express, { NextFunction, Request, Response } from "express";
import { authValidator } from "../validations";
import { authController, initializeClass } from "../controller";

declare module "express-serve-static-core" {
    interface Request {
        auth: InstanceType<typeof authController>;
    }
}

const assignController = (req: Request, res: Response, next: NextFunction) => {
    req.auth = initializeClass(req, res, next, authController);
    next();
};

const authRouter = express.Router();

authRouter.use(assignController);

authRouter.post("/send-otp", [authValidator.validateSendOtp], (req: Request) => req.auth.sendOtp());
authRouter.post("/verify-otp", [authValidator.validateVerifyOtp], (req: Request) => req.auth.verifyOtp());

export default authRouter;

