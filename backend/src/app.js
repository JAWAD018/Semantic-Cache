import express from "express";
import cors from "cors";

import askRoute from "./routes/ask.route.js";
import embeddingRoute from "./routes/embedding.route.js";
import statsRoute from "./routes/stats.route.js";
import breethRoute from "./routes/breeth.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/ask", askRoute);
app.use("/api/embedding", embeddingRoute);

app.use("/api/stats", statsRoute);

app.use("/api/breeth", breethRoute);

export default app;