import asyncErrorHandler from "../../errors/asyncErrorHandler";
import Jwt from "jsonwebtoken";
import CustomError from "../../errors/CustomError";
import { generateJwtToken, generateRefreshJwtToken } from "../../utils/generateTokens";
import { User } from "../../models/authentication/users.model";
import { APP_REFRESH_JWT_SECRET } from "../../config";

export default asyncErrorHandler(async function refreshToken(req, res, next) {
	const cookies = req.cookies;
	if (!cookies.tokenID || cookies.tokenID === undefined) {
		const error = new CustomError(401, "Unauthorized user");
		return next(error);
	}
	const refreshToken = cookies.tokenID;
	res.clearCookie("tokenID", {
		httpOnly: true,
		sameSite: "none",
		secure: true,
	});

	const user = await User.findOne({ refreshToken });
	if (!user) {
		Jwt.verify(refreshToken, APP_REFRESH_JWT_SECRET, async (err, decode) => {
			if (err) {
				const error = new CustomError(401, "Unauthorized...");
				return next(error);
			}

			//* Validating hacked User
			const hackedUser = await User.findOne({ email: decode.email }).exec();
			hackedUser.refreshToken = [];
			await hackedUser.save({ validateBeforeSave: false });
		});
		return next(new CustomError(403, "Forbidden"));
	}

	//* Filtering out the different refreshTokens
	const newRefreshTokenArray = user.refreshToken.filter(rt => rt !== refreshToken);

	Jwt.verify(refreshToken, APP_REFRESH_JWT_SECRET, async (err, decode) => {
		if (err) {
			user.refreshToken = [...newRefreshTokenArray];
			const result = await user.save({ validateBeforeSave: false });
		}
		if (err || user.email !== decode.email) {
			return next(403, "Forbidden");
		}
		const payload = {
			username: user.username,
			email: user.email,
			id: user._id,
			role: user.role,
		};

		//* Generating New Tokens
		const accessToken = await generateJwtToken(payload);
		const newRefreshToken = await generateRefreshJwtToken({
			email: user.email,
		});

		//* Saving refreshToken with current User
		user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
		const result = await user.save({ validateBeforeSave: false });

		//* Creating secure cookie with refresh Token
		res.cookie("tokenID", newRefreshToken, {
			httpOnly: true,
			sameSite: "none",
			secure: true,
		});
		res.json({
			AccessToken: accessToken,
		});
	});
});
