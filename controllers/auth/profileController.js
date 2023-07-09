import { User } from "../../models/authentication/users.model";
import asyncErrorHandler from "../../errors/asyncErrorHandler";
import CustomError from "../../errors/CustomError";

export default asyncErrorHandler(async function getProfile(req, res, next) {
	const id = req.id;
	const user = await User.findById(id).exec();
	if (!user) {
		const error = new CustomError(404, "User Not Found");
		return next(error);
	}
	res.status(200).json({
		data: {
			success: true,
			user: {
				firstname: user.firstname,
				lastname: user.lastname,
				username: user.username,
				email: user.email,
			},
		},
	});
});
