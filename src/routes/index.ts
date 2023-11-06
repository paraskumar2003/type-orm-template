import express from "express";
import authRouter from "./auth";


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



export default router;