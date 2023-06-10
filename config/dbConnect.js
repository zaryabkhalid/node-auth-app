import mongoose from "mongoose";
import { APP_MONGODB_URI } from "../config";

export async function connectDB() {
	try {
		await mongoose.connect(APP_MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			dbName: "Authentication",
		});
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
}
const db = mongoose.connection;

db.on("connecting", () => {
	console.log("Trying to establish a connection to database...");
});

db.on("connected", () => {
	console.log("Connected to database...");
});

db.on("error", error => {
	console.log(`Error: ${error.name} Message: {$error.message}`);
});

db.on("disconnected", () => {
	console.log("disconnected...");
});

process.on("SIGINT", () => {
	db.close(() => {
		console.log("Database disconnected...");
		process.exit(0);
	});
});
