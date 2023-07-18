import CustomError from "../../errors/CustomError";
import asyncErrorHandler from "../../errors/asyncErrorHandler";
import { User } from "../../models/authentication/users.model";
import sendMail from "../../utils/sendEmail";

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

	if (!newUser) {
		return next(new CustomError(500, "User Registration fails"));
	}

	const message = `
	<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Registeration Successfull</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6em;">
      <div style="max-width: 600px; margin: 0 auto;">
        <h1 style="color: #007BFF;">Hello, ${newUser.username}</h1>
        <p>Thank you for choosing Node Auth App.</p>  
        <p style="color: #333;">You can also include links in your email. For example, <a href="https://www.example.com">Click here</a> to visit our website.</p>
				<p>Here is your account ID ${newUser._id}</p>
        <p style="color: #333;">Thank you for registering your Account at Node Auth App.!</p>
        <p style="color: #888; font-size: 12px;">This is an automated email, please do not reply.</p>
    </div>
    </body>
  </html>`;

	try {
		await sendMail({
			sendToEmail: newUser.email,
			subject: "Registration Successfull",
			message: message,
		});
	} catch (err) {
		return next(new CustomError(400, "Sending Registration Successfull Email failed.."));
	}

	res.status(201).json({
		success: true,
		statuscode: 201,
		message: "Registration Successfull",
	});
});
