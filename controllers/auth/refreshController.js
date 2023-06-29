import asyncHandler from "express-async-handler";
import Jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { generateJwtToken } from "../../utils/generateTokens";
import { User } from "../../models/authentication/users.model";
import { APP_REFRESH_JWT_SECRET } from "../../config";

export default asyncHandler(async function refreshToken(req, res, next) {
	const cookies = req.cookies;
	if (!cookies.tokenID || cookies.tokenID === undefined) {
		return next(createHttpError.Unauthorized());
	}
	const refreshToken = cookies.tokenID;
	const user = await User.findOne({ refreshToken }).exec();
	if (!user) {
		return next(createHttpError.Forbidden());
	}
	await Jwt.verify(
		refreshToken,
		APP_REFRESH_JWT_SECRET,
		async function (err, decode) {
			if (err || user.email != decode.email) {
				return next(createHttpError.Forbidden());
			}
			const payload = {
				username: user.username,
				email: user.email,
				id: user._id,
				role: user.role,
			};
			const accessToken = await generateJwtToken(payload);
			res.json({
				AccessToken: accessToken,
			});
		},
	);
});
