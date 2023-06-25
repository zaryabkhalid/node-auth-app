import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { UserSignupValidation } from "../validations/signupValidation";
import createHttpError from "http-errors";
import { createUser, getUser } from "../service/user/userService";
import {
	generateJwtToken,
	generateRefreshJwtToken,
} from "../utils/generateTokens";

export const authController = {
	//** SIGNUP CONTROLLER *******/
	signup: asyncHandler(async (req, res, next) => {
		//** Validating User entered values ****
		UserSignupValidation.validate(req.body, (err, data) => {
			if (err) return next(err);
		});

		try {
			const { firstname, lastname, email, username, password } = req.body;
			const emailExists = await getUser(email);
			if (emailExists) {
				return next(createHttpError.BadRequest("Email already exists try different email"));
			}
			const userData = {
				firstname: firstname,
				lastname: lastname,
				username: username,
				email: email,
				password: password,
			};

			const user = await createUser(userData);

			if (user) {
				res.status(201).json({
					success: true,
					statuscode: 201,
					data: {
						username: user.username,
						email: user.email,
					},
				});
			} else {
				next(createHttpError.BadRequest("Registration Fails"));
			}
		} catch (error) {
			next(error);
		}
	}),

	//*** LOGIN CONTROLLER */
	signin: asyncHandler(async (req, res, next) => {
		const { email, password } = req.body;

		//* Checking for empty values
		if (!email || !password) {
			return next(createHttpError.BadRequest("Invalid Credentials"));
		}

		//* Validating User Exists or Not
		try {
			const userExists = await getUser(email);
			if (!userExists) {
				return next(createHttpError.BadRequest("User doesn't exists"));
			}
			const user = await bcrypt.compare(password, userExists.password);
			if (!user) {
				return next(createHttpError.BadRequest("Invalid Password"));
			}
			const payload = {
				email: userExists.email,
				id: userExists._id,
				role: userExists.role,
			};

			const token = await generateJwtToken(payload);
			const refToken = await generateRefreshJwtToken(payload);

			res.status(200).json({
				data: {
					email: userExists.email,
					username: userExists.username,
					tokens: {
						AccessToken: token,
						RefreshToken: refToken,
					},
				},
			});
		} catch (error) {
			next(error);
		}
	}),
};
