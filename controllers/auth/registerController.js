import asyncHandler from "express-async-handler";
import { UserSignupValidation } from "../../validations/signupValidation";
import createHttpError from "http-errors";
import { createUser, getUser } from "../../service/user/userService";

export default asyncHandler(async function signup(req, res, next) {
	//** Validating User entered values ****
	UserSignupValidation.validate(req.body, (err, data) => {
		if (err) return next(err);
	});

	try {
		const { firstname, lastname, email, username, password } = req.body;
		const emailExists = await getUser(email);
		if (emailExists) {
			return next(
				createHttpError.Unauthorized(
					"Email already exists try different email",
				),
			);
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
			next(createHttpError.InternalServerError("Registration Fails"));
		}
	} catch (error) {
		next(error);
	}
});
