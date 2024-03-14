require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const db = require("./models");

const app = express();

app.use(express.json());
app.use(helmet()); // Add security headers

if (process.env.NODE_ENV === "production") {
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 100,
      standardHeaders: "draft-7",
      legacyHeaders: false,
    })
  );
}

const userRouter = require("./routes/user");

app.use("/api/users", userRouter);

// Not Found
app.use((req, res, next) => {
  res.status(404).json({ message: "Route does not exists" });
});

// Error Handler
app.use((err, req, res, next) => {
  res.status(500).json({ message: "Something went wrong" });
  console.log(err);
});

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log("server running on port 3000");
  });
});
