import asyncErrorHandler from "../../errors/asyncErrorHandler";
import CustomError from "../../errors/CustomError";
import { User } from "../../models/authentication/users.model";
import sendMail from "../../utils/sendEmail";

const accountVerifiedController = asyncErrorHandler(async (req, res, next) => {
	const userID = req.params.id;
	const verifiedUser = await User.findOneAndUpdate({ _id: userID }, { $set: { isVerified: true } });

	if (!verifiedUser) {
		const error = new CustomError(500, "User's account cannot be verified. Please try again later");
		return next(error);
	}

	try {
		await sendMail({
			sendToEmail: verifiedUser.email,
			subject: "Account Verify Successfully.",
			message: `Congratulations! ${verifiedUser.username} your account has been Verified.`,
		});
	} catch (error) {
		verifiedUser.isVerified = false;
		return next(new CustomError(500, "There is a Problem to verifing your account.Please try again later"));
	}

	res.status(200).json({
		status: "Success",
		message: "Verification Done!",
	});
});

export default accountVerifiedController;
