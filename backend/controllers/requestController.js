const requestModel = require("../models/requestModel");

// CREATE REQUEST
const createRequestController = async (req, res) => {
  try {
    req.body.hospital = req.body.userId;
    const request = new requestModel(req.body);
    await request.save();
    return res.status(201).send({
      success: true,
      message: "Blood Request Submitted Successfully",
      request,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Create Request API",
      error,
    });
  }
};

// GET REQUESTS FOR A HOSPITAL
const getHospitalRequestsController = async (req, res) => {
  try {
    const requests = await requestModel
      .find({ hospital: req.body.userId })
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "Hospital Requests Fetched Successfully",
      requests,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Get Hospital Requests API",
      error,
    });
  }
};

// GET ALL REQUESTS (FOR ADMIN)
const getAllRequestsController = async (req, res) => {
  try {
    const requests = await requestModel
      .find({})
      .populate("hospital", "hospitalName email phone")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "All Requests Fetched Successfully",
      requests,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Get All Requests API",
      error,
    });
  }
};

// UPDATE REQUEST STATUS
const updateRequestStatusController = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await requestModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!request) {
      return res.status(404).send({
        success: false,
        message: "Request Not Found",
      });
    }
    return res.status(200).send({
      success: true,
      message: `Request Status Updated To ${status}`,
      request,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Update Request Status API",
      error,
    });
  }
};

module.exports = {
  createRequestController,
  getHospitalRequestsController,
  getAllRequestsController,
  updateRequestStatusController,
};
