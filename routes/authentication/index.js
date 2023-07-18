import express from "express";
import signup from "../../controllers/auth/registerController";
import signin from "../../controllers/auth/loginController";
import getProfile from "../../controllers/auth/profileController";
import refreshToken from "../../controllers/auth/refreshController";
import verifyJWT from "../../middlewares/verifyJwt";
import logout from "../../controllers/auth/logoutController";
import verifyUserAccount from "../../controllers/auth/accountVerifyController";
import resetPassword from "../../controllers/auth/resetPasswordController";
import forgetPassword from "../../controllers/auth/forgetPasswordController";

const router = express.Router();
/**
 **  POST REQUEST
 **  PUBLIC
 **  USER Registration
 */
router.post("/register", signup);

/**
 **  GET REQUEST
 **  PUBLIC
 **  USER Account Verify
 */

router.get("/verify", verifyUserAccount);

/**
 **  POST REQUEST
 **  PUBLIC
 **  User Login
 */
router.post("/login", signin);

/**
 **  GET REQUEST
 **  PRIVATE
 **  Get New Access Token
 */
router.get("/refresh-token", refreshToken);

/**
 **  GET REQUEST
 **  PRIVATE
 **  Get New Access Token
 */
router.get("/logout", logout);

/**
 **  GET REQUEST
 **  PRIVATE
 **  Get User Details
 */

router.get("/me", verifyJWT, getProfile);

/**
 ** POST & PATCH REQUEST
 ** PRIVATE
 ** FORGOT PASSWORD & RESET PASSWORD
 */

router.post("/forgetPassword", forgetPassword);
router.patch("/resetPassword/:token", resetPassword);

export default router;
