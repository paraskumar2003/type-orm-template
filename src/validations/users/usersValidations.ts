import joi from "joi";

export const usersValidations = {
    createUser: joi.object({
        username: joi.string()
            .pattern(/^[A-Za-z\s]+$/) // Only letters and spaces
            .min(2)
            .max(50)
            .trim()
            .required(),
        mobile: joi.string()
            .pattern(/^[0-9]{10}$/) // Exactly 10 digits
            .trim()
            .required(),
        role: joi.string()
            .valid('SuperAdmin', 'Admin', 'Coordinator') // Allowed values
            .required(),
        pin: joi.string()
            .pattern(/^[A-Za-z0-9]{1,6}$/) // Alphanumeric with max length 6
            .optional()
            .trim(),
    }),
    addUserInRoom: joi.object({
        mobile: joi
            .string()
            .pattern(/^[0-9]{10}$/)
            .required(),
        password: joi
            .string()
            .optional(),
    }),
};



