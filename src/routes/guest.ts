import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import { initializeClass } from "../controller";
import { GuestController } from "../controller";
import MiddleWares from "../middlewares";
const upload = multer();

const guestRouter = express.Router();

declare module "express-serve-static-core" {
    interface Request {
        guest: InstanceType<typeof GuestController>;
    }
}

const assignController = (req: Request, res: Response, next: NextFunction) => {
    req.guest = initializeClass(req, res, next, GuestController);
    next();
};

guestRouter.use(assignController);

guestRouter.get("/", (req: Request) => req.guest.handleResponse)
guestRouter.post("/upload", upload.single('file'), MiddleWares.parseCsv, (req: Request) => req.guest.uploadCsvFile())
guestRouter.get("/upload", (req: Request) => req.guest.fetchGuestList())
guestRouter.get("/upload/sample", (req: Request) => req.guest.downloadCsvFile())

export default guestRouter;