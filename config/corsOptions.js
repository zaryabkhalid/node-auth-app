import { whiteList } from "./allowedUrls";

export const corsOptions = {
	origin: function (origin, callback) {
		if (whiteList.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error("Not Allowed by CORS"));
		}
	},
	optionsSuccessStatus: true,
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
	credentials: true,
	maxAge: 3600,
};
