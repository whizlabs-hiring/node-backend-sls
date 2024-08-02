require('dotenv').config();

const B2B_LMS_DB_HOST = process.env.B2B_LMS_DB_HOST;
const B2B_LMS_DB_USER = process.env.B2B_LMS_DB_USER;
const B2B_LMS_DB_NAME = process.env.B2B_LMS_DB_NAME;
const B2B_LMS_DB_PASSWORD = process.env.B2B_LMS_DB_PASSWORD;
const B2B_LMS_DB_PORT = process.env.B2B_LMS_DB_PORT;

const DB_POOL = { min: 0, max: 15 };

const KnexB2BLms = require("knex")({
  client: "pg",
  connection: {
    host: B2B_LMS_DB_HOST,
    user: B2B_LMS_DB_USER,
    password: B2B_LMS_DB_PASSWORD,
    port: B2B_LMS_DB_PORT,
    database: B2B_LMS_DB_NAME,
  },
  pool: DB_POOL,
});

module.exports = { KnexB2BLms };
