const express = require("express");
const authMiddleware = require("../middlewares/authMiddelware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const {
  createRequestController,
  getHospitalRequestsController,
  getAllRequestsController,
  updateRequestStatusController,
} = require("../controllers/requestController");

const router = express.Router();

// routes

// CREATE REQUEST || POST
router.post("/create", authMiddleware, createRequestController);

// GET HOSPITAL REQUESTS || GET
router.get("/get-hospital-requests", authMiddleware, getHospitalRequestsController);

// GET ALL REQUESTS (ADMIN) || GET
router.get("/get-all-requests", authMiddleware, adminMiddleware, getAllRequestsController);

// UPDATE STATUS (ADMIN) || PUT
router.put("/update-status/:id", authMiddleware, adminMiddleware, updateRequestStatusController);

module.exports = router;
