import express from "express";
import { authValidator } from "../validations/auth/authValidator";
import { authController } from "../controller/auth/authController";
// import { authValidations } from "src/validations/auth/authValidations";

const authRouter = express.Router();

authRouter.post("/register", [authValidator.validateRegisterAPI], authController.register);

export default authRouter;

