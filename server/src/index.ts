import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { generateRouter } from "./routes/generate";

dotenv.config();

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  })
);

app.get("/health", (_, res) => res.json({ ok: true }));

app.use("/api", generateRouter);

const port = Number(process.env.PORT || 3333);
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
