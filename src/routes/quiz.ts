import express, { NextFunction, Request, Response } from "express";
import { initializeClass, QuizController } from "../controller";
import { quizValidator } from "../validations";
const quizRouter = express.Router();

declare module "express-serve-static-core" {
    interface Request {
        quiz: InstanceType<typeof QuizController>;
    }
}

const assignController = (req: Request, res: Response, next: NextFunction) => {
    req.quiz = initializeClass(req, res, next, QuizController);
    next();
};

quizRouter.use(assignController)

quizRouter.get("/", (req: Request) => req.quiz.getQuesitons())
quizRouter.post("/", [quizValidator.validateSaveAnswer], (req: Request) => req.quiz.saveAnswer());
quizRouter.post("/upi", [quizValidator.validateUPI], (req: Request) => req.quiz.saveUpi());

export default quizRouter;