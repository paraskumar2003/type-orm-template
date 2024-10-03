import express, { NextFunction, Request, Response } from "express";
import { initializeClass } from "../controller";
import { CheckListController } from "../controller";

const checkListRouter = express.Router();

declare module "express-serve-static-core" {
    interface Request {
        checklist: InstanceType<typeof CheckListController>;
    }
}

const assignController = (req: Request, res: Response, next: NextFunction) => {
    req.checklist = initializeClass(req, res, next, CheckListController);
    next();
};

checkListRouter.use(assignController);

checkListRouter.get("/", (req: Request) => req.checklist.handleResponse);
checkListRouter.post("/", (req: Request) => req.checklist.createCheckLists());

export default checkListRouter;