import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";

export const logEvents = async (message, logFileName) => {
	const dateTime = format(new Date(), `yyyy-MM-dd  HH:mm:ss`);
	const logItem = `Logs: ${dateTime}\t${uuid()}\t${message}\n`;
	try {
		if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
			fsPromises
				.mkdir(path.join(__dirname, "..", "logs"))
				.then(() => {
					console.log("created file");
				})
				.catch(error => {
					console.log(error);
				});
		}
		fsPromises
			.appendFile(path.join(__dirname, "..", "logs", logFileName), logItem)
			.then(() => {
				console.log("Logs Updated...");
			})
			.catch(error => {
				console.log(error);
			});
	} catch (error) {
		console.log(error);
	}
};

export const logger = (req, res, next) => {
	logEvents(
		`${res.statusCode}\t${req.method}\t${req.protocol}\t${req.hostname}\t${req.path}\t`,
		"reqLogs.log",
	);
	console.log(res.statusCode);
	next();
};
