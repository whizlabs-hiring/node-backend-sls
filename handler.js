const serverless = require("serverless-http");
const express = require("express");
const app = express();

app.get("/ping", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from backend!",
  });
});


app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.ping = serverless(app);
