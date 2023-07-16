import CustomError from "../../errors/CustomError";
import asyncErrorHandler from "../../errors/asyncErrorHandler";
import { User } from "../../models/authentication/users.model";

export const verifyUserAccount = asyncErrorHandler(async (req, res, next) => {
	const id = req.query.id;
	const userVerify = await User.findOneAndUpdate({ id }, { $set: { isVerified: true } });
	if (!userVerify) {
		return next(new CustomError(400, "User Account Verification Failed. kindly try it later"));
	}
	res.status(200).json({
		success: true,
		statusCode: 200,
		message: "Account verify",
	});
});
