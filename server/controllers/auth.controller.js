const User = require("../models/User");
const bcrypt = require("bcryptjs");
let jwt = require("jsonwebtoken");
let passwordPattern = /^(?=.{8,})(?=.*[A-Z])(?=.*[@#$%^&+*!=]).*$/;
let emailPattern = /^\S+@\S+\.\S+$/;
let mobilePattern = /^\d{10}$/;
let roles = ["admin", "trainer", "member"];
async function registerUser(user) {
  try {
    if (!user) {
      return { message: "User Data is incorrect", status: "Error" };
    }
    if (!user.first_name) {
      return { message: "first name is required", status: "Error" };
    }
    if (!user.last_name) {
      return { message: "last name is required", status: "Error" };
    }

    if (!user.email) {
      return { message: "email is required", status: "Error" };
    } else {
      isValidEmail = user.email.match(emailPattern);
      if (!isValidEmail) {
        return { message: "Enter a valid email.", status: "Error" };
      }
    }
    if (!user.mobile) {
      return { message: "mobile is required", status: "Error" };
    }
    if (!user.password) {
      return { message: "password is required", status: "Error" };
    }
    if (!user.role) {
      return { message: "user role is required", status: "Error" };
    }
    if (!user.status) {
      return { message: "status is required", status: "Error" };
    }
    let isEmailExists = await User.findOne({ email: user.email });
    if (isEmailExists) {
      return {
        message: "Email is already registered try different one.",
        status: "Error",
      };
    }

    let isMobileExists = await User.findOne({ mobile: user.mobile });
    if (isMobileExists) {
      return {
        message: "Mobile no. is already registered try different one.",
        status: "Error",
      };
    }
    let isPasswordCorrect = user.password.match(passwordPattern);
    if (isPasswordCorrect) {
      user.password = bcrypt.hashSync(user.password, 10);
    } else {
      return { message: "password is not correct.", status: "Error" };
    }

    let isMobileValid = user.mobile.match(mobilePattern);
    if (!isMobileValid) {
      return {
        message: "Enter valid mobile.",
        status: "Error",
      };
    }

    if (!roles.includes(user.role)) {
      return { message: "Enter a correct role.", status: "Error" };
    }
    await User.create(user);
    return {
      message: "Account successfully created",
      status: "Success",
    };
  } catch (error) {
    return { message: "Internal server Error", status: "Error" };
  }
}

async function loginUser({ email, password, role }) {
  if (!email) return { message: "email should not be blank.", status: "Error" };
  if (!password)
    return { message: "password should not be blank.", status: "Error" };
  if (!role) return { message: "role should not be blank.", status: "Error" };
  try {
    let user = await User.findOne({ email, role });
    if (!user) {
      return { message: "User not found.", status: "Error" };
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return { message: "Password is incorrect", status: "Error" };
    }

    let token = jwt.sign(
      { id: user?._id, email: user?.email },
      process.env.SECRET_KEY,
      { expiresIn: "30d" }
    );
    return {
      status: "Success",
      message: "Logged in successfully",
      data: user,
      token,
    };
  } catch (error) {
    return { message: "Internal server Error", status: "Error" };
  }
}

module.exports = { registerUser, loginUser };
