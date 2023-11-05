import { Request, Response } from "express";
import User from "../../entity/user";

export const authController = {
    register: async (req: Request, res: Response) => {
        try {
            // using sql for user registration

            const { mobile, username, email, password } = req.body;

            const ifExist = await User.findOne({ where: { mobile: mobile } });

            console.log({ ifExist });

            if (ifExist) {

                return res.status(400).json({ success: false, message: "User already exists" });

            } else {

                let data = await User.createUser(username, mobile, email, password);
                return res.status(200).json({ success: true, message: "User created successfully", data, });

            }
        } catch (err) {

            return res.status(500).json({ success: false, message: "Something went wrong", data: err.message });

        }
    },
}