const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getDonarsListController,
  getHospitalListController,
  getOrgListController,
  deleteDonarController,
  createAdminBloodRequestController,
  getAdminBloodRequestsController,
  createDonorController,
} = require("../controllers/adminController");

const adminMiddleware = require("../middlewares/adminMiddleware");

//router object
const router = express.Router();

//Routes

//GET || DONAR LIST
router.get(
  "/donar-list",
  authMiddleware,
  adminMiddleware,
  getDonarsListController
);
//GET || HOSPITAL LIST
router.get(
  "/hospital-list",
  authMiddleware,
  adminMiddleware,
  getHospitalListController
);
//GET || ORG LIST
router.get(
  "/org-list", 
  authMiddleware, 
  adminMiddleware,
   getOrgListController);
// ==========================

// DELETE DONAR || GET
router.delete(
  "/delete-donar/:id",
  authMiddleware,
  adminMiddleware,
  deleteDonarController
);

// ADMIN BLOOD REQUEST (to donor / organisation)
router.post(
  "/create-blood-request",
  authMiddleware,
  adminMiddleware,
  createAdminBloodRequestController
);

router.get(
  "/blood-requests",
  authMiddleware,
  adminMiddleware,
  getAdminBloodRequestsController
);

// CREATE DONOR || POST
router.post(
  "/create-donor",
  authMiddleware,
  adminMiddleware,
  createDonorController
);

//EXPORT
module.exports = router;
