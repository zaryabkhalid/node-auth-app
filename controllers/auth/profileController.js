import { User } from "../../models/authentication/users.model";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";

export default asyncHandler(async function getProfile(req, res, next) {
	const id = req.id;
	try {
		if (!id || id === "") {
			return next(createHttpError.Unauthorized("User ID is not defined"));
		}
		const user = await User.findById(id).exec();
		if (!user) {
			return next(createHttpError.NotFound("User Not Found"));
		}
		res.json({
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
	} catch (err) {
		next(err);
	}
});
