import { NODE_ENV } from "../config";
import { castErrorHandler, validationErrorhandler, duplicationErrorHandler } from "../errors/operationalErrorHandler";

//* DEV ENV RESPONSE
const devErrors = (res, error) => {
	res.status(error.statusCode).json({
		status: error.statusCode,
		message: error.message,
		stackTrace: error.stack,
		error: error,
	});
};

//* PRODUCTION ENV RESPONSE
const prodErrors = (res, error) => {
	if (error.isOperational) {
		res.status(error.statusCode).json({
			status: error.statusCode,
			message: error.message,
		});
	} else {
		res.status(500).json({
			status: "error",
			message: "Something went wrong please try again later",
		});
	}
};

//* Global Error Handling Middleware
export default (error, req, res, next) => {
	error.statusCode = error.statusCode || 500;
	error.status = error.status || "error";

	//* DEV ENV Error handler
	if (NODE_ENV === "development") {
		devErrors(res, error);
	}

	//* PROD ENV Error handler
	else if (NODE_ENV === "production") {
		if (error.name === "CastError") error = castErrorHandler(error);
		if (error.code === 11000) error = duplicationErrorHandler(error);
		if (error.name === "ValidationError") error = validationErrorhandler(error);

		prodErrors(res, error);
	}
};
