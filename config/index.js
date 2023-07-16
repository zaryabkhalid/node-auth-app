import dotenv from "dotenv";
dotenv.config();

export const {
	APP_PORT,
	APP_MONGODB_URI,
	APP_JWT_SECRET,
	APP_REFRESH_JWT_SECRET,
	NODE_ENV,
	APP_SMTP_HOST,
	APP_SMTP_USERNAME,
	APP_SMTP_PASS,
	APP_SMTP_PORT,
	APP_SMTP_SECURE,
} = process.env;
