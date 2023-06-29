import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { getUser } from "../../service/user/userService";
import {
	generateJwtToken,
	generateRefreshJwtToken,
} from "../../utils/generateTokens";

//*** LOGIN CONTROLLER */
export default asyncHandler(async function signin(req, res, next) {
	const { email, password } = req.body;

	//* Checking for empty values
	if (!email || !password) {
		return next(
			createHttpError.Unauthorized("Email or password can't be empty"),
		);
	}

	//* Validating User Exists or Not
	try {
		const userExists = await getUser(email);
		if (!userExists) {
			return next(createHttpError.Unauthorized("User doesn't exists"));
		}
		const passwordMatch = await bcrypt.compare(password, userExists.password);
		if (!passwordMatch) {
			return next(createHttpError.Unauthorized("Invalid Password"));
		}
		const payload = {
			username: userExists.username,
			email: userExists.email,
			id: userExists._id,
			role: userExists.role,
		};

		//! Generating Tokens
		const token = await generateJwtToken(payload);
		const refToken = await generateRefreshJwtToken(payload);

		//! Saving Refresh Token in Database
		userExists.refreshToken.push(refToken);
		await userExists.save();
		res.cookie("tokenID", refToken, {
			httpOnly: true,
			maxAge: 30 * 24 * 60 * 60 * 1000,
		});

		//! sending response
		res.status(200).json({
			data: {
				email: userExists.email,
				username: userExists.username,
				tokens: {
					AccessToken: token,
				},
			},
		});
	} catch (error) {
		next(error);
	}
});
