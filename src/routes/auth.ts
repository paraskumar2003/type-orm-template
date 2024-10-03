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

authRouter.post("/register", [authValidator.validateRegisterAPI], (req: Request) => req.auth.register());
authRouter.post("/login", [authValidator.validateLoginAPI], (req: Request) => req.auth.login());
authRouter.get("/invite/:room_user_id", (req: Request) => req.auth.acceptInvite());
authRouter.post("/invite/:room_user_id", [authValidator.validateCreatePasswordAPI], (req: Request) => req.auth.acceptInviteWithPassword());

export default authRouter;

