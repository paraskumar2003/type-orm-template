import { NextFunction, Request, Response } from "express";
import { authValidations } from "./authValidations";

export const authValidator = {
    validateRegisterAPI: async (req: Request, res: Response, next: NextFunction) => {
        const value = await authValidations.register.validate(req.body);
        errorValue(value, res, next);
    }
}

const errorValue = async (value: any, res: Response, next: NextFunction) => {
    if (value.error) {
        return res.status(403).json({ success: false, message: value.error.details[0].message });
    } else {
        next();
        return true;
    }
}