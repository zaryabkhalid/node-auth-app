import { APP_JWT_SECRET, APP_REFRESH_JWT_SECRET } from "../config";
import jwt from "jsonwebtoken";

export const generateJwtToken = async payload => {
	const token = jwt.sign(payload, APP_JWT_SECRET, {
		expiresIn: "30s",
	});
	return token;
};
export const generateRefreshJwtToken = async payload => {
	const refreshToken = jwt.sign(payload, APP_REFRESH_JWT_SECRET, {
		expiresIn: "30d",
	});
	return refreshToken;
};
