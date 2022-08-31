const authRoute = require("express").Router();
const { registerUser, loginUser } = require("../controllers/auth.controller");
authRoute.post("/register", async (req, res) => {
  let { message, status } = await registerUser(req.body);
  if (message === "password is not correct.") {
    return res.status(501).send(message);
  }
  if (status === "Error") return res.send(message);
  res.status(200).send(message);
});

authRoute.post("/login", async (req, res) => {
  let response = await loginUser(req.body);

  if (response.status === "Error") return res.send(response.message);
  delete response.status;
  res.status(200).json(response);
});

module.exports = authRoute;
