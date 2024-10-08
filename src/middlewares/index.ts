import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

declare module "express-serve-static-core" {
    interface Request {
        user: any;
        room_user: any;
        decoded: any;
        parsedCsv: Record<string, any>[] | []
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
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string); // Replace 'your_secret_key' with your actual secret key

            console.log({ decoded });

            // Attach the decoded token to the request for use in other middleware/routes
            req.decoded = decoded;

            req.user = decoded;
            next(); // Pass control to the next middleware
            return true;

        } catch (error) {
            return res.status(401).json({ success: false, message: "Invalid or expired token", data: null, error: null });
        }
    }

    static async parseCsv(req: Request, res: Response, next: NextFunction) {
        try {

            if (!req.file || !req.file.buffer) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded',
                });
            }
            const buffer = req.file.buffer.toString('utf-8');

            // Extract headers from the first line
            const headers = buffer
                .split('\n')[0]
                ?.split(',')
                .map((header) => header.replace(/\r|\s/g, ''));

            // Extract the rows (skip the header row)
            const items = buffer.split('\n').slice(1);

            const data = items.map((item) => {
                const columns = item.split(',');
                const rowObject: Record<any, any> = {};

                // Dynamically map headers to their respective values for each row
                headers.forEach((header, index) => {
                    rowObject[header] = columns[index] ? columns[index].trim() : '';
                });

                return rowObject;
            });

            // Store the parsed data in the request object for the next middleware or route handler
            req.parsedCsv = data; // No filtering
            next();
            return;

        } catch (err) {
            return res.status(400).json({ success: false, message: "Corrupt or Invalid File", data: null, error: null });
        }
    }
}

export default MiddleWares;
