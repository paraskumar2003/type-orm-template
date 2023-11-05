import joi from "joi";
export const authValidations = {
    register: joi.object({
        username: joi
            .string()
            .pattern(/^[A-Za-z\s]+$/)
            .min(2)
            .max(50)
            .trim()
            .required(),
        email: joi.string().email().required(),
        mobile: joi
            .string()
            .pattern(/^[0-9]{10}$/)
            .required(),
        password: joi.string().required(),
    }),
    login: joi.object({
        username: joi.string().pattern(/^[A-Za-z\s]+$/).min(2).max(50).trim().required(),
        password: joi.string().required()
    })
}