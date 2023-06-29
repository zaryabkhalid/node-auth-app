import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import Jwt from "jsonwebtoken";
import { APP_JWT_SECRET } from "../config";
const verifyJWT = asyncHandler(async (req, res, next) => {
	let token;
	if (!req.headers.authorization || req.headers.authorization === undefined) {
		return next(createHttpError.Forbidden());
	}

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			token = req.headers.authorization.split(" ")[1];
			Jwt.verify(token, APP_JWT_SECRET, (err, decode) => {
				if (err) {
					return next(createHttpError.Unauthorized());
				}
				req.id = decode.id;
				next();
			});
		} catch (error) {
			next(error);
		}
	}
});

export default verifyJWT;
