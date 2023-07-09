import { app } from "./app";
import { APP_PORT } from "./config";
import { connectDB } from "./config/dbConnect";

process.on("uncaughtException", err => {
	console.log(err.name, err.message);
	console.log("Uncaught Exception Occur! App is shutting down...");
	process.exit(1);
});

connectDB();

const PORT = APP_PORT || 4000;
const server = app.listen(APP_PORT, () => {
	console.log(`Server is listening on PORT ${PORT}`);
});

process.on("unhandledRejection", err => {
	console.log(err.name, err.message);
	console.log("Unhandled rejection Occur! App is shutting down...");
	server.close(() => {
		process.exit(1);
	});
});
