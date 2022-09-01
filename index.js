const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");
require("dotenv").config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/auth", authRoute);
app.use("/users", userRoute);
mongoose.connect(process.env.MONGO_URL, () => {
  console.log("Database is connected");
});
app.get("/", (req, res) => {
  res.send("Hello Users");
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
