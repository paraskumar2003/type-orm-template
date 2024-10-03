import express, { NextFunction, Request, Response } from "express";
import { initializeClass, UsersController } from "../controller";
import { usersValidator } from "../validations";
const usersRouter = express.Router();

declare module "express-serve-static-core" {
    interface Request {
        users: InstanceType<typeof UsersController>;
    }
}

const assignController = (req: Request, res: Response, next: NextFunction) => {
    req.users = initializeClass(req, res, next, UsersController);
    next();
};

usersRouter.use(assignController)

usersRouter.post("/", [usersValidator.validateCreateUserApi], (req: Request) => req.users.createUser())
usersRouter.get("/", (req: Request) => req.users.fetchUserList())

export default usersRouter;