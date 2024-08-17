const serverless = require("serverless-http");
const express = require("express");
const app = express();

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from custom root!",
  });
});

app.get("/hello", (req, res, next) => {
  const reqMessage = req.body.data;
  return res.status(200).json({
    message: "Hello from custom path!",
    log: reqMessage
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.Handler = serverless(app);
