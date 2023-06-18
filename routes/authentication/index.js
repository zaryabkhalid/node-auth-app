import express from "express";
import { authController } from "../../controllers/authentication";

const router = express.Router();
/**
 **  POST REQUEST
 **  PUBLIC
 **  USER Registration
 */
router.post("/register", authController.signup);

/**
 **  POST REQUEST
 **  PUBLIC
 **  User Login
 */
router.post("/login", authController.signin);

export default router;
