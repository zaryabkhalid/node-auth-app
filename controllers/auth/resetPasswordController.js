import asyncErrorHandler from "../../errors/asyncErrorHandler";
import CustomError from "../../errors/CustomError";
import crypto from "crypto";
import { User } from "../../models/authentication/users.model";
import { generateJwtToken } from "../../utils/generateTokens";

const resetPassword = asyncErrorHandler(async (req, res, next) => {
	const resetToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
	const user = await User.findOne({ passwordResetToken: resetToken, passwordResetTokenExpire: { $gt: Date.now() } });
	if (!user) {
		return next(new CustomError(400, "Token is Invalid or has expired!"));
	}

	user.password = req.body.password;
	user.confirm_password = req.body.password;
	user.passwordChangedAt = Date.now();
	user.passwordResetToken = undefined;
	user.passwordResetTokenExpire = undefined;

	await user.save();

	res.status(200).json({
		status: "Success",
		message: "Password successfully has been reset",
	});
});

export default resetPassword;
