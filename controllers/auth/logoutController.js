import asyncErrorHandler from "../../errors/asyncErrorHandler";
import CustomError from "../../errors/CustomError";
import { User } from "../../models/authentication/users.model";

export default asyncErrorHandler(async function logout(req, res, next) {
	const cookies = req.cookies;
	if (!cookies.tokenID || cookies.tokenID === null) {
		return next(new CustomError(204, "No-Content"));
	}
	const refreshToken = cookies.tokenID;
	const user = await User.findOne({ refreshToken });
	if (!user) {
		res.clearCookie("tokenID", {
			httpOnly: true,
			sameSite: "none",
			secure: true,
		});
		res.sendStatus(204);
	}
	user.refreshToken = user.refreshToken.filter(rt => rt !== refreshToken);
	await user.save({ validateBeforeSave: false });

	res.clearCookie("tokenID", {
		httpOnly: true,
		secure: true,
		sameSite: "none",
	});
	res.status(204).json({
		message: "Logout Successfull...",
	});
});
