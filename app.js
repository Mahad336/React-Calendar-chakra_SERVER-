const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const cookieParser = require("cookie-parser");
const path = require("path");
const { checkUser } = require("./middlewares/authMiddleware");
const app = express();
dotenv.config();

// middleware

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// database connection
const dbURI = process.env.dataBaseUrl;
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => app.listen(process.env.PORT || 8000))
  .catch((err) => console.log(err));

// routes
app.use("*", checkUser);
app.use("/user", authRoutes);
app.use("/events", eventRoutes);
