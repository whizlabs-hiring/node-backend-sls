const { KnexB2BLms } = require("./config/db");

module.exports.dbCheck = async (event, context, callback) => {


  let dbStatus = {};

  try {
    const data = await KnexB2BLms.raw("select 1+1 as result");
    if (data) {
      dbStatus = "Connected";
    }
  } catch (error) {
    console.error(error);
    dbStatus = "Not Connected";
  } finally {
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: `Hello, the current time is ${new Date().toTimeString()}.`,
        db_status: dbStatus,
      }),
    };

    callback(null, response);
    KnexMaster.destroy();
  }
};

module.exports.time = async (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello, the current time is ${new Date().toTimeString()}.`,
    }),
  };

  callback(null, response);
};
