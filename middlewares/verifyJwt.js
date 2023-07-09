import asyncErrorHandler from "../errors/asyncErrorHandler";
import CustomError from "../errors/CustomError";
import Jwt from "jsonwebtoken";
import { APP_JWT_SECRET } from "../config";

const verifyJWT = asyncErrorHandler(async (req, res, next) => {
	let token;
	if (!req.headers.authorization || req.headers.authorization === undefined) {
		const error = new CustomError(403, "Forbidden");
		return next(error);
	}

	if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
		token = req.headers.authorization.split(" ")[1];
		Jwt.verify(token, APP_JWT_SECRET, (err, decode) => {
			if (err) {
				const error = new CustomError(401, "Unauthorized");
				return next(error);
			}
			req.id = decode.id;
			next();
		});
	}
});

export default verifyJWT;
