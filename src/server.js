const app = require("./app");
const connectDatabase = require("./config/database");


const PORT = process.env.PORT || 4000;
console.log(`Server is running on port ${PORT}`);
connectDatabase().then(() => {
    console.log("Database connected successfully");
  const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  process.on("uncaughtException", (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    console.error(err.stack);
    server.close(() => {
      process.exit(1);
    });
  });

  process.on("unhandledRejection", (err) => {
    console.log("ERROR :", err);
    console.error(`Unhandled Rejection: ${err.message}`);
    console.error(err.stack);
    server.close(() => {
      process.exit(1);
    });
  });
});
