import { NextFunction, Request, Response } from "express";
import { quizValidations } from "./quizValidations";

export const quizValidator = {
    validateUPI: async (req: Request, res: Response, next: NextFunction) => {
        const value = await quizValidations.saveUpi.validate(req.body);
        errorValue(value, res, next);
    },
    validateSaveAnswer: async (req: Request, res: Response, next: NextFunction) => {
        const value = await quizValidations.saveAnswer.validate(req.body);
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