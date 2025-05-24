import express from "express";
import { generateResponse } from "./generate-response";
import { throttled } from "./cached-pages";

const PORT = process.env["PORT"] || 3000;

const app = express();

const generateResponseThrottled = throttled(generateResponse);

app.get("/", async (req, res) => {
  res.set({
    "Cache-Control": "public, max-age=1",
    Expires: new Date(Date.now() + 1000).toUTCString(),
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
    "Content-Type": "text/html; charset=utf-8",
    "Content-Language": "en",
  });
  const response = await generateResponseThrottled();

  res.send(response);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
