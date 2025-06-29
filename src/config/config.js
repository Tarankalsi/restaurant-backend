const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  development: {
    mongodbUri: process.env.MONGO_URI,
  },
  production: {
    mongodbUri: process.env.MONGODB_URI_PROD,
  },
};
