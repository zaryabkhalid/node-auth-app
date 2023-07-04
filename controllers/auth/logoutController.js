import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { User } from "../../models/authentication/users.model";

export default asyncHandler(async function logout(req, res, next) {
	const cookies = req.cookies;
	if (!cookies.tokenID || cookies.tokenID === null) {
		return next(createHttpError("204", "No content"));
	}
	const refreshToken = cookies.tokenID;

	const user = await User.findOne({ refreshToken }).exec();
	if (!user) {
		res.clearCookie("tokenID", {
			httpOnly: true,
			sameSite: "none",
			secure: true,
		});
		res.sendStatus(204);
	}
	user.refreshToken = user.refreshToken.filter(rt => rt !== refreshToken);
	const result = await user.save();

	res.clearCookie("tokenID", {
		httpOnly: true,
		secure: true,
		sameSite: "none",
	});
	res.sendStatus(204);
});
