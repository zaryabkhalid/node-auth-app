import { logEvents } from "./logger";
function errorHandler(err, req, res, next) {
	const statusCode = err.statusCode || 500;
	const message = err.message || "Internal Server Error";
	logEvents(`${statusCode}\t${message}`, "reqErrorLogs.log");
	res.status(statusCode).send({
		error: {
			statusCode: statusCode,
			message: message,
		},
	});
}

export default errorHandler;
