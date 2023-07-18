import nodemailer from "nodemailer";
import { APP_SMTP_PORT, APP_SMTP_USERNAME, APP_SMTP_PASS, APP_SMTP_HOST } from "../config";

const sendMail = async ({ sendToEmail, subject, message }) => {
	const transporter = nodemailer.createTransport({
		host: APP_SMTP_HOST,
		port: APP_SMTP_PORT,
		auth: {
			user: APP_SMTP_USERNAME,
			pass: APP_SMTP_PASS,
		},
	});

	await transporter.sendMail(
		{
			from: "NodeAuthApp support<support@nodeAuthApp.com>",
			to: sendToEmail,
			subject: subject,
			html: message,
		},
		(err, info) => {
			if (err) {
				console.log(err.stack);
				return;
			} else if (info) {
				console.log(info.response);
				return;
			}
		},
	);
};

export default sendMail;
