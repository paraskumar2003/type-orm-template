import express, { NextFunction, Request, Response } from "express";
import { initializeClass, RoomsController } from "../controller";
import { roomsValidator } from "../validations";
const roomsRouter = express.Router();

declare module "express-serve-static-core" {
    interface Request {
        rooms: InstanceType<typeof RoomsController>;
    }
}

const assignController = (req: Request, res: Response, next: NextFunction) => {
    req.rooms = initializeClass(req, res, next, RoomsController);
    next();
};

roomsRouter.use(assignController)

roomsRouter.post("/", [roomsValidator.validateCreateRoomApi], (req: Request) => req.rooms.createRoom())
roomsRouter.get("/", (req: Request) => req.rooms.fetchAvailableRooms())

// check-in room
roomsRouter.post("/check-in", [roomsValidator.validateCheckInRoom], (req: Request) => req.rooms.checkInRoom());

export default roomsRouter;