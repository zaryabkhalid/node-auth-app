import asyncErrorHandler from "../../errors/asyncErrorHandler";
import { User } from "../../models/authentication/users.model";
import CustomError from "../../errors/CustomError";
import sendMail from "../../utils/sendEmail";

const forgetPassword = asyncErrorHandler(async (req, res, next) => {
	// Get the user based on email
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		const error = new CustomError(404, "We could not found the user with given email");
		next(error);
	}

	// Generate a resetPassword Token
	const resetToken = user.createResetPasswordToken();
	await user.save({ validateBeforeSave: false });

	// Send the resetToken back to the user via Email
	const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/resetPassword/${resetToken}`;
	const message = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Registeration Successfull</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6em;">
      <div style="max-width: 600px; margin: 0 auto;">
        <h1 style="color: #007BFF;">Reset Password</h1>  
				<p>We have received a password reset request. Please use the below link to reset your password. <a href=${resetUrl}>Reset Password</a></p>
				<p>This reset password link will be valid for only 10 Minutes</p>
        <p style="color: #888; font-size: 12px;">This is an automated email, please do not reply.</p>
    </div>
    </body>
  </html>`;

	try {
		await sendMail({
			sendToEmail: user.email,
			subject: "Reset Password",
			message: message,
		});
		res.status(200).json({
			status: "Success",
			message: "Password reset link sent to the user email",
		});
	} catch (err) {
		user.passwordResetToken = undefined;
		user.passwordResetTokenExpire = undefined;
		user.save({ validateBeforeSave: false });
		return next(new CustomError(500, "There was an error sending password reset email. Please try again later"));
	}
});

export default forgetPassword;
