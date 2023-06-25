import { APP_JWT_SECRET, APP_REFRESH_JWT_SECRET } from "../config";
import jwt from "jsonwebtoken";

export const generateJwtToken = async payload => {
	const token = await jwt.sign(payload, APP_JWT_SECRET, {
		expiresIn: 1000 * 60 * 15,
	});
	return token;
};
export const generateRefreshJwtToken = async payload => {
	const refreshToken = await jwt.sign(payload, APP_JWT_SECRET, {
		expiresIn: "30d",
	});
	return refreshToken;
};
