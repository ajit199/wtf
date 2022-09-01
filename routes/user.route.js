const userRoute = require("express").Router();
const { getUser, getAllUsers } = require("../controllers/user.controller");

userRoute.get("/", async (req, res) => {
  let users = await getAllUsers(req);
  if (users.status === "Error") return res.status(401).send(user.message);
  delete users.status;
  res.status(200).json(users);
});

userRoute.get("/user", async (req, res) => {
  let user = await getUser(req);
  if (user.status === "Error") return res.status(401).send(user.message);
  delete user.status;
  res.status(200).json(user);
});
module.exports = userRoute;
