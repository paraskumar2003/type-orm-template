import { NextFunction, Request, Response } from "express";
import { roomsValidations } from "./roomValidations";

export const roomsValidator = {
    validateCreateRoomApi: async (req: Request, res: Response, next: NextFunction) => {
        const value = await roomsValidations.createRoom.validate(req.body);
        errorValue(value, res, next);
    },
    validateCheckInRoom: async (req: Request, res: Response, next: NextFunction) => {
        const value = await roomsValidations.checkInRoom.validate(req.body);
        errorValue(value, res, next);
    }
}

const errorValue = async (value: any, res: Response, next: NextFunction) => {
    if (value.error) {
        return res.status(403).json({ success: false, message: value.error.details[0].message, data: null, error: { message: value?.error?.details[0].message } });
    } else {
        next();
        return true;
    }
}