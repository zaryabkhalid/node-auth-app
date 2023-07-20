import CustomError from "../../errors/CustomError";
import asyncErrorHandler from "../../errors/asyncErrorHandler";
import { User } from "../../models/authentication/users.model";
import sendMail from "../../utils/sendEmail";

const verifyUserEmail = asyncErrorHandler(async (req, res, next) => {
	const user_id = req.params.id;
	const user = await User.findOne({ _id: user_id });
	if (!user) {
		const error = new CustomError(404, "Invalid user ID User's account cannot be verified.");
		return next(error);
	}

	const verificationUrl = `${req.protocol}://${req.get("host")}/api/v1/verifyuser/${user._id}`;
	const message = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Account Verification</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6em;">
      <div style="max-width: 600px; margin: 0 auto;">
        <h1 style="color: #007BFF;">Hello, ${user.username}</h1>
        <p>Thank you for choosing Node Auth App.</p>  
        <p style="color: #333;">Kindly varify your account to make sure that your account remains fully protected in future.</p>
        <p style="color: #007BFF;">Click to the verify  <a href=${verificationUrl}>Verify</a></p>
        <p style="color: #333;">You can also include links in your email. For example, <a href="https://www.example.com">Click here</a> to visit our website.</p>
        
        <p style="color: #333;">Thank you for reading!</p>
        <p style="color: #888; font-size: 12px;">This is an automated email, please do not reply.</p>
    </div>
    </body>
  </html>`;

	try {
		await sendMail({
			sendToEmail: user.email,
			subject: "Account Verification",
			message: message,
		});
	} catch (error) {
		user.isVerified = false;
		return next(new CustomError("There was an error sending verification email. Try again later"));
	}

	res.status(200).json({
		success: true,
		statusCode: 200,
		message: "Verification Email has been sent. Check your email",
	});
});

export default verifyUserEmail;
