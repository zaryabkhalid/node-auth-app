import CustomError from "../../errors/CustomError";
import asyncErrorHandler from "../../errors/asyncErrorHandler";
import { User } from "../../models/authentication/users.model";
import { sendRegistrationSuccessfullMail } from "../../utils/regSuccessfullMail";
import { sendAccountVerificationEmail } from "../../utils/verifyUserAccount";

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
	const newUser = await user.save();
	await sendRegistrationSuccessfullMail(newUser.email, newUser.username, newUser._id);
	if (!newUser) {
		return next(new CustomError(500, "User Registration fails"));
	}

	await sendAccountVerificationEmail(newUser.email, newUser.username, newUser._id);

	res.status(201).json({
		success: true,
		statuscode: 201,
		message: "Registration Successfull",
	});
});
