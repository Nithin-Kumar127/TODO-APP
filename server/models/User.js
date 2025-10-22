const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // Change this to match User.js
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
},{timestamps: true});

const User = mongoose.model("User", userSchema);
module.exports = User;