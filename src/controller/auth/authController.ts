import { Request, Response } from "express";
import { User, Otp } from "../../entity/mysql";

export const authController = {
    register: async (req: Request, res: Response) => {
        try {

            // using sql for user registration

            const { mobile, username, email, password } = req.body;

            const ifExist = await User.findOne({ where: { mobile: mobile } });

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
    login: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            const user: any = User.findOne({ where: { email } });

            if (!user) {
                return res.status(400).json({ success: false, message: "No user exist with this email" });
            } else {
                if (user.password === password) {
                    return res.status(200).json({ success: true, message: "User logged in successfully", data: user });
                } else {
                    return res.status(402).json({ success: false, message: "Incorrect username or password" });
                }
            }
        } catch (err) {
            return res.status(500).json({ success: false, message: "Something went wrong", data: err.message });
        }
    },
    sendOtp: async (req: Request, res: Response) => {
        try {
            const { mobile } = req.query;

            if (!mobile) {
                return res.status(404).json({ success: false, message: "No mobile number provided" });
            } else {
                const isAlreadySent: any = await Otp.findOne({ where: { mobile: mobile as string, status: 1 } });
                console.log({ isAlreadySent });

                if (isAlreadySent) {
                    return res.status(401).json({ success: false, message: "Otp has been already sent" });
                } else {

                    const otp = Math.floor(Math.random() * 9000 + 1000);

                    console.log({ otp });

                    if (otp) {
                        const newOtp = new Otp();
                        newOtp.otp = otp;
                        newOtp.mobile = mobile as string;
                        newOtp.status = 1;
                        await newOtp.save();
                        return res.status(200).json({ success: true, message: "Otp sent successfully" });
                    } else {
                        throw new Error("Error while generating otp");
                    }
                }
            }
        } catch (err) {
            return res.status(500).json({ success: false, message: "Something went wrong", data: err.message });
        }
    },
    verifyOtp: async (req: Request, res: Response) => {
        try {
            const { mobile, otp } = req.body;

            if (!mobile || !otp) {
                return res.status(404).json({ success: false, message: "Please provide valid mobile or otp" });
            } else {
                const doOtpExist = await Otp.findOne({ where: { mobile, otp } });

                if (!doOtpExist) {
                    return res.status(402).json({ success: false, message: "Incorrect Otp" });
                } else {
                    if (doOtpExist.status == 1) {
                        return res.status(200).json({ success: true, message: "Otp verified successfully" });
                    } else if (doOtpExist.status == 2) {
                        return res.status(200).json({ success: false, message: "Otp already verified" });
                    } else {
                        return res.status(200).json({ success: false, message: "Invalid Otp" });
                    }
                }
            }
        } catch (err) {
            return res.status(500).json({ success: false, message: "Something went wrong" });
        }
    }
}