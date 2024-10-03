import joi from "joi";

export const roomsValidations = {
    createRoom: joi.object({
        room_name: joi
            .string()
            .pattern(/^[A-Za-z_\s]+$/)
            .min(2)
            .max(50)
            .trim()
            .required(),
        room_pin: joi
            .string()
            .pattern(/^[0-9]+$/)
            .optional(),
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
    checkInRoom: joi.object({
        room_id: joi.string().required()
    })
};
