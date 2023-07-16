import { APP_SMTP_HOST, APP_SMTP_PORT, APP_SMTP_SECURE, APP_SMTP_USERNAME, APP_SMTP_PASS } from "../config";
import nodemailer from "nodemailer";

export const sendAccountVerificationEmail = async (userEmail, userName, user_id) => {
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
		subject: "Verification email",
		html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Account Verification</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6em;">
      <div style="max-width: 600px; margin: 0 auto;">
        <h1 style="color: #007BFF;">Hello, ${userName}</h1>
        <p>Thank you for choosing Node Auth App.</p>  
        <p style="color: #333;">Kindly varify your account to make sure that your account remains fully protected in future.</p>
        <p style="color: #007BFF;">Click to the verify  <a href='http://localhost:3000/api/v1/verify?id=${user_id}'>Verify</a></p>
        <p style="color: #333;">You can also include links in your email. For example, <a href="https://www.example.com">Click here</a> to visit our website.</p>
        
        <p style="color: #333;">Thank you for reading!</p>
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
