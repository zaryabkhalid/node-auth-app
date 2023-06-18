import Joi from "joi";

export const UserSignupValidation = Joi.object({
	firstname: Joi.string().min(3).max(16).required().trim(),

	lastname: Joi.string().min(3).max(16).required().trim(),

	username: Joi.string().alphanum().min(3).max(16).required().trim(),

	email: Joi.string()
		.email({
			minDomainSegments: 2,
			tlds: { allow: ["com", "net"] },
		})
		.required()
		.trim(),

	password: Joi.string()
		.pattern(new RegExp("^[a-zA-Z0-9]{8,18}$"))
		.required()
		.trim(),

	repeat_password: Joi.ref("password"),
});
