import express from "express";
import cors from "cors";
import { corsOptions } from "./config/corsOptions";
import { jsonOptions } from "./config/jsonOptions";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import CustomError from "./errors/CustomError";
import errorHandler from "./middlewares/ErrorHandler";
import compression from "compression";
import authRouter from "./routes/authentication";

export const app = express();

// CORS
app.use(cors(corsOptions));

app.use(
	express.urlencoded({
		extended: true,
	}),
);
app.use(express.json(jsonOptions));

// Cookie Parser
app.use(cookieParser());

// HELMET for headers-security
app.use(helmet());

app.use(compression());

app.use("/api/v1", authRouter);

// 404 Error
app.all("*", (req, res, next) => {
	const err = new CustomError(404, `Can't find ${req.originalUrl} on the server`);
	next(err);
});

// Global Error Handler
app.use(errorHandler);
