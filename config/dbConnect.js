import mongoose from "mongoose";
import { APP_MONGODB_URI } from "../config";

export function connectDB() {
	mongoose.connect(APP_MONGODB_URI, {
		useNewUrlParser: true,
		dbName: "Authentication",
	});
}

mongoose.connection.on("connected", () => {
	console.log("Connected to Database");
});
mongoose.connection.on("error", err => {
	console.error("MongoDB connection error:", err);
});
mongoose.connection.on("disconnected", () => {
	console.log("Disconnected from MongoDB");
});

process.on("SIGINT", () => {
	mongoose.connection.close(() => {
		console.log("MongoDB connection closed due to application termination");
		process.exit(0);
	});
});
