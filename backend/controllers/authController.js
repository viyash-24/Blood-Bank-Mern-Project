const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    if (req.body.role === 'admin') {
      return res.status(403).send({
        success: false,
        message: "Admin Registration not allowed",
      });
    }
    const exisitingUser = await userModel.findOne({ email: req.body.email });
    //validation
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "User ALready exists",
      });
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    //rest data
    const user = new userModel(req.body);
    await user.save();
    return res.status(201).send({
      success: true,
      message: "User Registerd Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Register API",
      error,
    });
  }
};

// Default Admin Creation
const createDefaultAdmin = async () => {
  try {
    const adminExists = await userModel.findOne({ role: "admin" });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);
      const admin = new userModel({
        name: "Admin",
        email: "admin",
        password: hashedPassword,
        role: "admin",
        phone: "0000000000",
      });
      await admin.save();
      console.log("Default admin created successfully!");
    }
  } catch (error) {
    console.log("Error creating default admin", error);
  }
};
createDefaultAdmin();

//login call back
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid Credentials",
      });
    }
    //check role
    if (user.role !== req.body.role) {
      return res.status(500).send({
        success: false,
        message: "role dosent match",
      });
    }
    //compare password
    const comparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!comparePassword) {
      return res.status(500).send({
        success: false,
        message: "Invalid Credentials",
      });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.status(200).send({
      success: true,
      message: "Login Successfully",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Login API",
      error,
    });
  }
};

//GET ALL CURRENT USER
const currentUserController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    return res.status(200).send({
      success: true,
      message: "User Fetched Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "unable to get current user",
      error,
    });
  }
};

// CHANGE PASSWORD
const changePasswordController = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await userModel.findById(req.body.userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.requirePasswordChange = false;
    await user.save();

    return res.status(200).send({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in change password API",
      error,
    });
  }
};

module.exports = { registerController, loginController, currentUserController, changePasswordController };
