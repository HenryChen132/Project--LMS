// server.js
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import app from "./server/express.js";
import connectDB from "./server/config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

await connectDB();

app.get("/", (_req, res) => {
  res.send("LMS API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
