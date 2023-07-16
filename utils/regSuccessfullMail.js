import nodemailer from "nodemailer";
import { APP_SMTP_PORT, APP_SMTP_USERNAME, APP_SMTP_PASS, APP_SMTP_SECURE, APP_SMTP_HOST } from "../config";

export const sendRegistrationSuccessfullMail = async (email, name, user_id) => {
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
		to: email,
		subject: "Registeration Successfull",
		html: `<h3>Hi ${name}</h3> <br/> <p>Welcome to the Node Auth APP. Your Account Registration has been succesfull.<p/> <a href='/'>Go to Home </a> 
    <p><strong>Your ID is ${user_id}</strong></p>`,
	};

	transporter.sendMail(mailOptions, function (err, info) {
		if (err) {
			console.log(err.stack);
		} else {
			console.log(info.response);
		}
	});
};
