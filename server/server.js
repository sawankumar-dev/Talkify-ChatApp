import http from "http"

import { connectDB } from "./src/config/db.js";
import app from "./src/app.js";
import config from "./src/config/config.js";

const startServer = async () => {
    await connectDB();
    const server = http.createServer(app);
    server.listen(config.PORT, () => {
        console.log(`Server running on http://localhost:${config.PORT}`)
    })
}
startServer();