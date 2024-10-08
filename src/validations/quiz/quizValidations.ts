import joi from "joi";

export const quizValidations = {
    saveUpi: joi.object({
        upi_id: joi
            .string()
            .pattern(/^[\w.\-_]{2,}@[a-zA-Z]{2,}$/)
            .required()
            .messages({
                'string.empty': 'UPI ID is required',
                'string.pattern.base': 'UPI ID must be valid, e.g., yourname@bankname',  // Custom message for invalid UPI ID
            }),
    }),
    saveAnswer: joi.object({
        question_id: joi
            .string()
            .required()
            .messages({
                'string.base': 'Question ID must be a string',
                'string.empty': 'Question ID is required',
                'any.required': 'Question ID is a mandatory field',
            }),
        choice_no: joi
            .string()
            .pattern(/^\d+$/)
            .max(2)
            .required()
            .messages({
                'string.base': 'Choice number must be a string of digits',
                'string.empty': 'Choice number is required',
                'string.pattern.base': 'Choice number must contain only digits',
                'string.max': 'Choice number must be less than 100',
                'any.required': 'Choice number is a mandatory field',
            }),
    })
};
