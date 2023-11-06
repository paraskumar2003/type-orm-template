import express from "express";
import { authValidator } from "../validations/auth/authValidator";
import { authController } from "../controller/auth/authController";
// import { authValidations } from "src/validations/auth/authValidations";

const authRouter = express.Router();



/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        username:
 *          type: string
 *          description: The username of the user
 *        mobile:
 *          type: string
 *          description: The mobile number of the user
 *        email:
 *          type: string
 *          description: The email address of the user
 *        password:
 *          type: string
 *          description: The password of the user
 *      required:
 *        - username
 *        - mobile
 *        - email
 *        - password
 *      example:
 *        username: "Paras Kumar"
 *        mobile: "1234567890"
 *        email: "email@gmail.com"
 *        password: "your-password"
 *
 *
 *  parameters:
 *    mobile:
 *      in: path
 *      name: id
 *      required: true
 *      schema:
 *        type: string
 *      description: The mobile number
 * 
 * 
 */





/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a user.
 *     description: Endpoint to register a new user.
 *     requestBody:
 *       description: User data to register.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User register successfully.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error
 *         
 */

authRouter.post("/register", [authValidator.validateRegisterAPI], authController.register);

export default authRouter;

