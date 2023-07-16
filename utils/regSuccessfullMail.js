import nodemailer from "nodemailer";
import { APP_SMTP_PORT, APP_SMTP_USERNAME, APP_SMTP_PASS, APP_SMTP_SECURE, APP_SMTP_HOST } from "../config";

export const sendRegistrationSuccessfullMail = async (userEmail, userName, user_id) => {
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
		subject: "Registeration Successfull",
		html: `
		<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Registeration Successfull</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6em;">
      <div style="max-width: 600px; margin: 0 auto;">
        <h1 style="color: #007BFF;">Hello, ${userName}</h1>
        <p>Thank you for choosing Node Auth App.</p>  
        <p style="color: #333;">You can also include links in your email. For example, <a href="https://www.example.com">Click here</a> to visit our website.</p>
				<p>Here is your account ID ${user_id}</p>
        <p style="color: #333;">Thank you for registeration.!</p>
        <p style="color: #888; font-size: 12px;">This is an automated email, please do not reply.</p>
    </div>
    </body>
  </html>`,
	};

	transporter.sendMail(mailOptions, function (err, info) {
		if (err) {
			console.log(err.stack);
		} else {
			console.log(info.response);
		}
	});
};
