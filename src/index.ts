import express from "express";
import { generateResponse } from "./generate-response";

const PORT = process.env["PORT"] || 3000;

const app = express();

app.get("/", async (req, res) => {
  const response = await generateResponse();
  res.send(response);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
