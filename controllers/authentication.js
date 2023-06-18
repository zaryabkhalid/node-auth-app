import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { UserSignupValidation } from "../validations/signupValidation";
import createHttpError from "http-errors";
import { signupService } from "../service/authService/signUpService";
import { User } from "../models/authentication/users.model";

export const authController = {
	//** SIGNUP CONTROLLER *******/
	signup: asyncHandler(async (req, res, next) => {
		const { firstname, lastname, email, username, password, repeat_password } =
			req.body;

		//** Validating User entered values ****

		const { error } = await UserSignupValidation.validate(req.body);

		if (error) next(createHttpError(400, error.message));

		try {
			const userExists = await User.findOne({ email: email }).exec();
			if (userExists) {
				return next(createHttpError(400, "Email already Exists..."));
			}
		} catch (error) {
			return next(error);
		}

		const user = await signupService({
			firstname,
			lastname,
			username,
			email,
			password,
			repeat_password,
		});

		if (user) {
			res.status(201).json({
				data: {
					firstname: user.firstname,
					lastname: user.lastname,
					username: user.username,
					email: user.email,
				},
			});
		} else {
			next(createHttpError(400, "User registration fails..."));
		}
	}),

	//*** LOGIN CONTROLLER */
	signin: asyncHandler(async (req, res, next) => {
		const { email, password } = req.body;

		//* Checking for empty values
		if (!email || !password) {
			return next(createHttpError(400, "Must fill all values"));
		}

		//* Validating User Exists or Not
		try {
			const userExists = await User.findOne({ email: email }).exec();
			if (!userExists) {
				return next(createHttpError(400, "User doesn't exists"));
			}

			const user = await bcrypt.compare(password, userExists.password);
			if (!user) {
				return next(createHttpError(400, "Invalid Cradentials"));
			}

			res.send("User Logged In...");
		} catch (error) {
			return next(error);
		}
	}),
};
