import express from "express";
import authRouter from "./auth";
import roomsRouter from "./rooms";
import MiddleWares from "../middlewares";
import usersRouter from "./users";
import guestRouter from "./guest";
import checkListRouter from "./checklist";

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
router.use("/rooms", MiddleWares.verifyUser, roomsRouter);
router.use("/users", MiddleWares.verifyUser, MiddleWares.isUserPartOfTheRoom, usersRouter);
router.use("/guests", MiddleWares.verifyUser, MiddleWares.isUserPartOfTheRoom, guestRouter);
router.use("/checklist", MiddleWares.verifyUser, MiddleWares.isUserPartOfTheRoom, checkListRouter);


export default router;