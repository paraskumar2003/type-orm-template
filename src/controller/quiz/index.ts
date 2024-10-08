import { NextFunction, Request, Response } from "express";
import { BaseController, DerivedClassResponse } from "..";

class QuizController extends BaseController {

    constructor(protected req: Request, protected res: Response, next: NextFunction) {
        super(req, res, next);
    }

    async getQuesitons() {

        this.executeSafely(async (): Promise<DerivedClassResponse> => {

            return {
                success: false,
                message: "Questions fetched successfully",
                data: {
                    questions: [
                        {
                            question_id: 1,
                            question_text: "What is the capital of France?",
                            options: [
                                { option_text: "Paris", choice_no: 1 },
                                { option_text: "London", choice_no: 2 },
                                { option_text: "Rome", choice_no: 3 },
                                { option_text: "Berlin", choice_no: 4 }
                            ]
                        },
                        {
                            question_id: 2,
                            question_text: "Which planet is known as the Red Planet?",
                            options: [
                                { option_text: "Earth", choice_no: 1 },
                                { option_text: "Mars", choice_no: 2 },
                                { option_text: "Venus", choice_no: 3 },
                                { option_text: "Jupiter", choice_no: 4 }
                            ]
                        },
                        {
                            question_id: 3,
                            question_text: "What is the chemical symbol for water?",
                            options: [
                                { option_text: "H2O", choice_no: 1 },
                                { option_text: "O2", choice_no: 2 },
                                { option_text: "CO2", choice_no: 3 },
                                { option_text: "HO", choice_no: 4 }
                            ]
                        }
                    ]
                },
                error: null,
                statusCode: 200
            };

        });

    }

    async saveAnswer() {
        this.executeSafely(async (): Promise<DerivedClassResponse> => {
            return {
                success: true,
                message: "Answer saved successfully",
                statusCode: 200,
                error: null,
                data: null
            }
        })
    }

    async saveUpi() {
        console.log("called");

        this.executeSafely(async (): Promise<DerivedClassResponse> => {
            return {
                success: true,
                message: "UPI Id saved successfully",
                statusCode: 200,
                data: null,
                error: null
            }
        })

    }

}

export { QuizController };