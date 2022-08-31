let jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const getAllUsers = async (request) => {
  let filters = {};
  if (request.query.name) {
    let name = request.query.name;
    let firstname = "";
    let index = null;
    for (let i = 0; i < name.length; i++) {
      if (name[i] === " ") {
        index = i + 1;
        break;
      } else {
        firstname += name[i];
      }
    }
    filters.first_name = firstname;
    let lastName = "";
    if (index !== null) {
      for (let i = index; i < name.length; i++) {
        lastName += name[i];
      }

      if (lastName.length > 0) {
        filters.last_name = lastName;
      }
    }
    // let nameArr = request.query.name.split(" ");
    // if(nameArr.length === 1){
    //     filters.first_name = nameArr[0];
    // }else{

    // }
    // filters.name = request.query.name;
  }
  if (request.query.email) {
    filters.email = request.query.email;
  }
  if (request.query.mobile) {
    filters.mobile = request.query.mobile;
  }
  if (request.query.status) {
    filters.status = request.query.status;
  }
  if (request.query.role) {
    filters.role = request.query.role;
  }
  try {
    let users = await User.find(filters);
    return { users, status: "Success" };
  } catch (error) {
    return { message: "Internal Server Error", status: "Error" };
  }
};
const getUser = async (request) => {
  let token = request.headers["authorization"]?.split(" ")[1];
  //   console.log(token);
  if (!token) {
    return { message: "You have not authorized", status: "Error" };
  }
  try {
    let userDetails = jwt.verify(token, process.env.SECRET_KEY);
    let { id } = userDetails;
    let user = await User.findOne({ _id: id });
    return { user, status: "Success" };
  } catch (error) {
    return { message: "Internal Server Error", status: "Error" };
  }
};

module.exports = { getUser, getAllUsers };
