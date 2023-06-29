import express from "express";
import signup from "../../controllers/auth/registerController";
import signin from "../../controllers/auth/loginController";
import getProfile from "../../controllers/auth/profileController";
import refreshToken from "../../controllers/auth/refreshController";
import verifyJWT from "../../middlewares/verifyJwt";

const router = express.Router();
/**
 **  POST REQUEST
 **  PUBLIC
 **  USER Registration
 */
router.post("/register", signup);

/**
 **  POST REQUEST
 **  PUBLIC
 **  User Login
 */
router.post("/login", signin);

/**
 **  GET REQUEST
 **  PRIVATE
 **  Get User Details
 */

router.get("/me", verifyJWT, getProfile);

/**
 **  GET REQUEST
 **  PRIVATE
 **  Get New Access Token
 */
router.get("/refresh-token", refreshToken);

export default router;
