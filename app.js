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
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// view engine
app.set("view engine", "ejs");

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

app.use(authRoutes);
app.use("/events", eventRoutes);
app.get("/", (req, res) => res.render("login"));

app.get("/display-events", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/index.html"));
});
