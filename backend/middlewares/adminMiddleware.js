const userModel = require("../models/userModel");
module.exports = async (req, res, next) => {
  try {
    const userId = req.userId || req.body?.userId;
    const user = await userModel.findById(userId);
    //check admin authenticity
    if (user?.role !== "admin") {
      return res.status(401).send({
        success: false,
        message: "Auth Failed",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      success: false,
      message: "Auth Failed, ADMIN API",
      error,
    });
  }
};
