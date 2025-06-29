const mongoose = require("mongoose");
// console.log("Mongoose Imported:", mongoose); // Check if mongoose is being imported

const env = process.env.NODE_ENV || "development";
const config = require("./config")[env];

// console.log("Database Config:", config); // Check if config is loaded correctly

mongoose.set("strictQuery", true);

const connectDatabase = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit the process on failure
  }
};

module.exports = connectDatabase;
