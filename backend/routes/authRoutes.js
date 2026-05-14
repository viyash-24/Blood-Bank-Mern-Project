const express = require("express");
const {
  registerController,
  loginController,
  currentUserController,
  changePasswordController,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

//routes
//REGISTER || POST
router.post("/register",  registerController);

//LOGIN || POST
router.post("/login", loginController);

//GET CURRENT USER || GET
router.get("/current-user", authMiddleware, currentUserController);

//CHANGE PASSWORD || POST
router.post("/change-password", authMiddleware, changePasswordController);

module.exports = router;
