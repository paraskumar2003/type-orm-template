import express, { NextFunction, Request, Response } from "express";
import { authValidator } from "../validations";
import { initializeClass } from "../controller";
import authController from "../controller/auth";

declare module "express-serve-static-core" {
    interface Request {
        instance: InstanceType<typeof authController>;
    }
}

const attachAuthController = (req: Request, res: Response, next: NextFunction) => {
    req.instance = initializeClass(req, res, next, authController);
    next();
};

const authRouter = express.Router();

authRouter.use(attachAuthController);

authRouter.post("/register", [authValidator.validateRegisterAPI], (req: Request) => req.instance.register());
authRouter.post("/login", [authValidator.validateRegisterAPI], (req: Request) => req.instance.register());

export default authRouter;

