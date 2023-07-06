import { app as server } from "./server";
import { connectDB } from "./config/dbConnect";
import { APP_PORT } from "./config";

const PORT = APP_PORT || 4000;
async function appServer() {
	await connectDB();
	server.listen(APP_PORT, () => {
		console.log(`Server is listening on PORT ${PORT}`);
	});
}

appServer();
