import express from "express";
import { generateResponse } from "./generate-response";
import { throttled } from "./cached-pages";

const PORT = process.env["PORT"] || 3000;

const app = express();

const generateResponseThrottled = throttled(generateResponse);

app.get("/", async (req, res) => {
  const response = await generateResponseThrottled();
  res.send(response);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
