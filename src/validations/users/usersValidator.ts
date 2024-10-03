import { NextFunction, Request, Response } from "express";
import { usersValidations } from "./usersValidations";

export const usersValidator = {
    validateCreateUserApi: async (req: Request, res: Response, next: NextFunction) => {
        const value = usersValidations.createUser.validate(req.body);
        errorValue(value, res, next);
    },
}

const errorValue = async (value: any, res: Response, next: NextFunction) => {
    if (value.error) {
        return res.status(403).json({ success: false, message: value.error.details[0].message, data: null, error: { message: value?.error?.details[0].message } });
    } else {
        next();
        return true;
    }
}