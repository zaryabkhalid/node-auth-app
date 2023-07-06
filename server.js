import express from "express";
import cors from "cors";
import { corsOptions } from "./config/corsOptions";
import { jsonOptions } from "./config/jsonOptions";
import helmet from "helmet";
import createHttpError from "http-errors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/ErrorHandler";
import compression from "compression";
import { logger } from "./middlewares/logger";
import authRouter from "./routes/authentication";

const app = express();

// Logger
app.use(logger);

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
app.get("*", (req, res, next) => {
	next(createHttpError(404, "Not found"));
});

app.use(errorHandler);

export { app };
