import asyncErrorHandler from "../../errors/asyncErrorHandler";
import CustomError from "../../errors/CustomError";
import { generateJwtToken, generateRefreshJwtToken } from "../../utils/generateTokens";
import { User } from "../../models/authentication/users.model";

//*** LOGIN CONTROLLER */
export default asyncErrorHandler(async function signin(req, res, next) {
	const cookies = req.cookies;
	const { email, password } = req.body;

	//* Checking for empty values
	if (!email || !password) {
		const error = new CustomError(400, "Email or password can't be empty");
		return next(error);
	}

	//* Validating User Exists or Not
	const userExists = await User.findOne({ email }).select("+password");
	if (!userExists || !(await userExists.comparePassword(password, userExists.password))) {
		const error = new CustomError(400, "Incorrect Email or password");
		return next(error);
	}

	//* Creating Payload for tokens
	const payload = {
		username: userExists.username,
		email: userExists.email,
		id: userExists._id,
		role: userExists.role,
	};

	//* Generating Tokens
	const token = await generateJwtToken(payload);
	const newRefToken = await generateRefreshJwtToken({
		email: userExists.email,
	});

	//* Checking if cookie already exist or not
	const newRefreshTokenArray = !cookies.tokenID
		? userExists.refreshToken
		: userExists.refreshToken.filter(rt => rt !== cookies.tokenID);
	if (cookies.tokenID) {
		res.clearCookie("tokenID", {
			httpOnly: true,
			secure: true,
			sameSite: "none",
		});
	}
	//* Saving Refresh Token in Database
	userExists.refreshToken = [...newRefreshTokenArray, newRefToken];
	await userExists.save({ validateBeforeSave: false });

	//* Saving cookie
	res.cookie("tokenID", newRefToken, {
		httpOnly: true,
		secure: true,
		sameSite: "none",
		maxAge: 30 * 24 * 60 * 60 * 1000,
	});

	//* sending response
	res.status(200).json({
		success: true,
		data: {
			AccessToken: token,
		},
	});
});
