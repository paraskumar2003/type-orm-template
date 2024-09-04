import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare module "express-serve-static-core" {
    interface Request {
        user: any;
    }
}

class MiddleWares {
    static async verifyUser(req: Request, res: Response, next: NextFunction) {
        try {
            // Extract the token from the Authorization header
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({ message: "Authorization header missing or malformed" });
            }

            const token = authHeader.split(" ")[1]; // Get the token part from 'Bearer <token>'

            // Decode or verify the token
            const decoded = jwt.verify(token, "your_secret_key"); // Replace 'your_secret_key' with your actual secret key

            // Attach the decoded token to the request for use in other middleware/routes
            req.user = decoded;

            next(); // Pass control to the next middleware
            return true;

        } catch (error) {
            return res.status(401).json({ success: false, message: "Invalid or expired token" });
        }
    }
}

export default MiddleWares;
