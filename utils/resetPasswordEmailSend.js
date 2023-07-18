import nodemailer from "nodemailer";
import { APP_SMTP_PORT, APP_SMTP_USERNAME, APP_SMTP_PASS, APP_SMTP_HOST } from "../config";
import crypto from "node:crypto";

export const sendRegistrationSuccessfullMail = async (userEmail, userName, user_id) => {
	const randomKey = crypto.randomBytes(64).toString("hex");
	const finalKey = randomKey + user_id;
	const transporter = nodemailer.createTransport({
		host: APP_SMTP_HOST,
		port: APP_SMTP_PORT,
		auth: {
			user: APP_SMTP_USERNAME,
			pass: APP_SMTP_PASS,
		},
	});

	const mailOptions = {
		from: APP_SMTP_USERNAME,
		to: userEmail,
		subject: "Reset Password",
		html: `
		<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Reset Password</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6em;">
      <div style="max-width: 600px; margin: 0 auto;">
        <h1 style="color: #007BFF;">Hello, ${userName}</h1>
        <p>To reset your password click on a link which is given below.</p>  
        <p style="color: #333;"><a href="http://localhost:3000/api/v1/reset_password/?user=${finalKey}">Reset Password</a></p>
        <p style="color: #888; font-size: 12px;">This is an automated email, please do not reply.</p>
    </div>
    </body>
  </html>`,
	};

	await transporter.sendMail(mailOptions, function (err, info) {
		if (err) {
			console.log(err.stack);
		} else {
			console.log(info.response);
		}
	});
};
