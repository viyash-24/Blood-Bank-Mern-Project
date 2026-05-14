const userModel = require("../models/userModel");
const adminBloodRequestModel = require("../models/adminBloodRequestModel");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

//GET ALL DONAR LIST
const getDonarsListController = async (req, res) => {
  try {
    const donarData = await userModel
      .find({ role: "donar" })
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      Toatlcount: donarData.length,
      message: "Donar List Fetched Successfully...",
      donarData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In DOnar List API",
      error,
    });
  }
};
//GET HOSPITAL LIST
const getHospitalListController = async (req, res) => {
  try {
    const hospitalData = await userModel
      .find({ role: "hospital" })
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      Toatlcount: hospitalData.length,
      message: "HOSPITAL List Fetched Successfully",
      hospitalData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Hospital List API",
      error,
    });
  }
};
//GET ORG LIST
const getOrgListController = async (req, res) => {
  try {
    const orgData = await userModel
      .find({ role: "organisation" })
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      Toatlcount: orgData.length,
      message: "ORG List Fetched Successfully",
      orgData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In ORG List API",
      error,
    });
  }
};
// =======================================

//DELETE DONAR
const deleteDonarController = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    return res.status(200).send({
      success: true,
      message: " Record Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while deleting ",
      error,
    });
  }
};

// CREATE ADMIN BLOOD REQUEST (to donor or organisation)
const createAdminBloodRequestController = async (req, res) => {
  try {
    const { bloodGroup, quantity, urgency, message, donor, organisation } = req.body;
    if (!bloodGroup || quantity === undefined || quantity === null || quantity === "") {
      return res.status(400).send({
        success: false,
        message: "Blood group and quantity are required",
      });
    }
    if (!donor && !organisation) {
      return res.status(400).send({
        success: false,
        message: "Select a donor or organisation recipient",
      });
    }

    const doc = await adminBloodRequestModel.create({
      admin: req.userId,
      bloodGroup,
      quantity: Number(quantity),
      urgency: urgency === "urgent" ? "urgent" : "normal",
      message: message || "",
      ...(donor ? { donor } : {}),
      ...(organisation ? { organisation } : {}),
    });

    return res.status(201).send({
      success: true,
      message: "Blood request sent successfully",
      request: doc,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error creating blood request",
      error: error.message,
    });
  }
};

// LIST ADMIN BLOOD REQUESTS (created by this admin)
const getAdminBloodRequestsController = async (req, res) => {
  try {
    const requests = await adminBloodRequestModel
      .find({ admin: req.userId })
      .populate("donor", "name email bloodGroup phone")
      .populate("organisation", "organisationName email phone")
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      message: "Admin blood requests fetched",
      requests,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error fetching admin blood requests",
      error: error.message,
    });
  }
};

// CREATE DONOR
const createDonorController = async (req, res) => {
  try {
    const { name, email, address, phone, bloodGroup, healthConditionChecked } = req.body;
    
    if (!healthConditionChecked) {
      return res.status(400).send({
        success: false,
        message: "Health condition must be checked and qualified to create a donor.",
      });
    }

    const exisitingUser = await userModel.findOne({ email });
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "User Already exists",
      });
    }

    const tempPassword = Math.random().toString(36).slice(-8);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    const user = new userModel({
      role: "donar",
      name,
      email,
      password: hashedPassword,
      address,
      phone,
      bloodGroup,
      requirePasswordChange: true,
      healthConditionChecked,
    });

    await user.save();

    // Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "test@gmail.com", // configure in .env
        pass: process.env.EMAIL_PASS || "testpass",
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || "test@gmail.com",
      to: email,
      subject: "Welcome to Blood Bank - Donor Membership",
      text: `Hello ${name},\n\nWelcome to Blood Bank! You have successfully been registered as a Donor Member.\n\nUsername: ${email}\nTemporary Password: ${tempPassword}\n\nPlease login and change your password immediately. After that, you will receive your membership card.\n\nThank you for your noble cause!`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Email Error:", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    return res.status(201).send({
      success: true,
      message: "Donor Created Successfully, Welcome Email Sent",
      user,
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Create Donor API",
      error,
    });
  }
};

//EXPORT
module.exports = {
  getDonarsListController,
  getHospitalListController,
  getOrgListController,
  deleteDonarController,
  createAdminBloodRequestController,
  getAdminBloodRequestsController,
  createDonorController,
};
