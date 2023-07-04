import asyncHandler from "express-async-handler";
import Jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import {
	generateJwtToken,
	generateRefreshJwtToken,
} from "../../utils/generateTokens";
import { User } from "../../models/authentication/users.model";
import { APP_REFRESH_JWT_SECRET } from "../../config";

export default asyncHandler(async function refreshToken(req, res, next) {
	const cookies = req.cookies;
	if (!cookies.tokenID || cookies.tokenID === null) {
		return next(createHttpError.Unauthorized());
	}
	const refreshToken = cookies.tokenID;
	res.clearCookie("tokenID", {
		httpOnly: true,
		sameSite: "None",
		secure: true,
	});
	const user = await User.findOne({ refreshToken }).exec();
	if (!user) {
		Jwt.verify(refreshToken, APP_REFRESH_JWT_SECRET, async (err, decode) => {
			if (err) {
				return next(createHttpError.Unauthorized());
			}
			const hackedUser = await User.findOne({ email: decode.email }).exec();
			hackedUser.refreshToken = [];
			const result = await hackedUser.save();
			console.log("Hacked User", result);
		});
		return next(createHttpError.Forbidden());
	}

	//* Filtering out the different refreshTokens
	const newRefreshTokenArray = user.refreshToken.filter(
		rt => rt !== refreshToken,
	);

	Jwt.verify(
		refreshToken,
		APP_REFRESH_JWT_SECRET,
		async function (err, decode) {
			if (err) {
				user.refreshToken = [...newRefreshTokenArray];
				const result = await user.save();
			}
			if (err || user.email !== decode.email) {
				return createHttpError.Forbidden();
			}
			const payload = {
				username: user.username,
				email: user.email,
				id: user._id,
				role: user.role,
			};

			//* Generating New Tokens
			const accessToken = generateJwtToken(payload);
			const newRefreshToken = generateRefreshJwtToken({ email: user.email });

			//* Saving refreshToken with current User
			user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
			const result = await user.save();

			//* Creating secure cookie with refresh Token
			res.cookie("tokenID", newRefreshToken, {
				httpOnly: true,
				sameSite: "none",
				secure: true,
			});
			res.json({
				AccessToken: accessToken,
			});
		},
	);
});
