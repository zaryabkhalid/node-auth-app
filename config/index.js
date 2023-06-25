import dotenv from "dotenv";
dotenv.config();

export const {
	APP_PORT,
	APP_MONGODB_URI,
	APP_JWT_SECRET,
	APP_REFRESH_JWT_SECRET,
} = process.env;
