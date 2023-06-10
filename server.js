import { APP_PORT } from "./config";
import express from "express";
import cors from "cors";
import { corsOptions } from "./config/corsOptions";
import { jsonOptions } from "./config/jsonOptions";
import helmet from "helmet";
import createHttpError from "http-errors";
import errorHandler from "./middlewares/ErrorHandler";
import compression from "compression";

const app = express();

// PORT
const PORT = APP_PORT || 4000;

// CORS
app.use(cors(corsOptions));

// HELMET for headers-security
app.use(helmet());

app.use(compression());

app.use(express.json(jsonOptions));
app.use(
	express.urlencoded({
		extended: true,
	}),
);

app.get("/", (req, res) => {
	res.status(200).json({
		data: {
			statusCode: 200,
			message: "Successfull Response...!",
		},
	});
});

// 404 Error
app.use(async (req, res, next) => {
	next(createHttpError(404, "Not found"));
});

app.use(errorHandler);

export { app };
