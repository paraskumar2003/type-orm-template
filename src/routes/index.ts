import express from "express";
import authRouter from "./auth";
import MiddleWares from "../middlewares";
import quizRouter from "./quiz";

const router = express.Router();
/**
  * @swagger
  * /:
  *   get:
  *     description: Returns the homepage
  *     responses:
  *       200:
  *         description: This is the most advance node server
  */

router.use("/auth", authRouter);
router.use("/quiz", MiddleWares.verifyUser, quizRouter);


export default router;