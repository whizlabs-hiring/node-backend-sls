const express = require("express");
const serverless = require("serverless-http");
const handleErrors = require("../middlewares/handleErrors");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.disable("x-powered-by");

const Routes = require("./src/routes/routes");
app.use("/auth", Routes);

// HANDLING ERRORS
app.use(handleErrors);

module.exports.app = serverless(app);
