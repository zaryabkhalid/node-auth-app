import CustomError from "../../errors/CustomError";
import asyncErrorHandler from "../../errors/asyncErrorHandler";
import { User } from "../../models/authentication/users.model";

export default asyncErrorHandler(async function signup(req, res, next) {
	const { firstname, lastname, email, username, password, confirm_password } = req.body;

	const userData = {
		firstname: firstname,
		lastname: lastname,
		username: username,
		email: email,
		password: password,
		confirm_password: confirm_password,
	};

	const user = new User(userData);
	await user.save();

	if (!user) {
		return next(new CustomError(500, "User Registration fails"));
	}

	res.status(201).json({
		success: true,
		statuscode: 201,
		message: "Registration Successfull",
	});
});
