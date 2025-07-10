const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

//! User registration

const usersController = {
  //Register
  register: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    //!validate
    if (!username || !email || !password) {
      throw new Error("All fields are required");
    }
    //!check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User already exists");
    }
    //!has the user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //!create the suer nd save to DB
    const userCreated = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    res.json({
      username: userCreated.username,
      email: userCreated.email,
      id: userCreated._id,
    });
  }),
  //Login
  login: asyncHandler(async (req, res) => {
    //get the user data
    const { email, password } = req.body;

    //check if email is valid
    const user = await User.findOne({ email });

    //!validate
    if (!user) {
      throw new Error("Invalid Email address");
    }
    //!compare the user password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid Password");
    }
    //!Generate token
    const token = jwt.sign({ id: user._id }, "mytokengenerate", {
      expiresIn: "30d",
    });
    //!send response
    res.json({
      message: "Login Success",
      token,
      id: user._id,
      email: user.email,
      username: user.username,
    });
  }),
  //profile
  profile: asyncHandler(async (req, res) => {
    //!find the user
    const user = await User.findById(req.user);
    if (!user) {
      throw new Error("User not found");
    }
    //!send the response
    res.json({ username: user.username, email: user.email });
  }),
  //!change pwd
  changeUserPassword: asyncHandler(async (req, res) => {
    const { newPassword } = req.body;
    //!find the user
    const user = await User.findById(req.user);
    if (!user) {
      throw new Error("User not found");
    }
    //!hash the new pwd
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    //!resave user
    await user.save({
      validateBeforeSave: false,
    });
    //!send the response
    res.json({ message: "Password changed Successfully" });
  }),
  //update user profile
  updateUserProfile: asyncHandler(async (req, res) => {
    const { email, username } = req.body;
    const updateUser = await User.findByIdAndUpdate(
      req.user,
      {
        username,
        email,
      },
      {
        new: true,
      }
    );
    res.json({ message: "User Profile updated Successfully", updateUser });
  }),
};
module.exports = usersController;
