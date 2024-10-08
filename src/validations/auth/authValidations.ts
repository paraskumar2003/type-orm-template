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
        email: joi
            .string()
            .email()
            .optional(),
        mobile: joi
            .string()
            .pattern(/^[0-9]{10}$/)
            .required(),
        password: joi
            .string()
            .optional(),
    }),
    login: joi.object({
        mobile: joi
            .string()
            .pattern(/^[0-9]{10}$/)
            .required(),
        password: joi
            .string()
            .required(),
    }),
    createPassword: joi.object({
        mobile: joi
            .string()
            .pattern(/^[0-9]{10}$/)
            .required(),
        password: joi
            .string()
            .required(),
    }),
    sendOtp: joi.object({
        mobile: joi
            .string()
            .pattern(/^[0-9]{10}$/, { name: 'numbers' }) // Custom name for pattern validation
            .required()
            .messages({
                'string.empty': 'Mobile number is required',  // If the field is empty
                'string.pattern.name': 'Mobile number must be 10 digits long and contain numbers only',  // Custom pattern message
                'string.pattern.base': 'Mobile number must contain numbers only',  // If it doesn't match the regex
            }),
    }),
    verifyOtp: joi.object({
        mobile: joi
            .string()
            .pattern(/^[0-9]{10}$/, { name: 'numbers' }) // Custom name for pattern validation
            .required()
            .messages({
                'string.empty': 'Mobile number is required',  // If the field is empty
                'string.pattern.name': 'Mobile number must be 10 digits long and contain numbers only',  // Custom pattern message
                'string.pattern.base': 'Mobile number must contain numbers only',  // If it doesn't match the regex
            }),
        otp: joi
            .string()
            .length(4)
            .required()
            .messages({
                'string.empty': 'OTP is required',
                'string.length': 'OTP must be exactly 6 digits long',
            })
    })
};
