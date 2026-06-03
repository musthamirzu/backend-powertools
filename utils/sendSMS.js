const axios = require("axios");

const sendSMS = async (message, number) => {
  try {
    await axios.post("https://www.fast2sms.com/dev/bulkV2", {
      route: "q",
      message,
      numbers: number
    },
    {
      headers:{
        authorization: process.env.SMS_API_KEY
      }
    });
  } catch (err) {
    console.log("SMS Error:", err.message);
  }
};

module.exports = sendSMS;