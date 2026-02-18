
import "dotenv/config";
import cors from "cors";
import express from "express";

import boardsRouter from "./routes/boards.js";

const app = express();
const port = process.env.PORT ?? "3000";

app.use(cors());
app.use(express.json());

app.use("/boards", boardsRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});