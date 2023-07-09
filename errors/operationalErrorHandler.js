import CustomError from "./CustomError";
//* type casting Error Handler
export const castErrorHandler = err => {
	const msg = `Invalid value for ${err.path}: ${err.value}`;
	return new CustomError(400, msg);
};

//* Duplication error
export const duplicationErrorHandler = err => {
	let msg;
	if (err.keyValue.email) {
		msg = `Email ${err.keyValue.email} is already taken!`;
		return new CustomError(400, msg);
	} else if (err.keyValue.username) {
		msg = `Username ${err.keyValue.username} is already taken!`;
		return new CustomError(400, msg);
	}
};

//* Validation Error
export const validationErrorhandler = err => {
	const errors = Object.values(err.errors).map(val => val.message);
	const errMessages = errors.join(". ");
	const msg = `Invalid input data: ${errMessages}`;
	return new CustomError(400, msg);
};
