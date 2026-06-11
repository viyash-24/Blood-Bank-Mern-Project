const inventoryModel = require("../models/inventoryModel");
const mongoose = require("mongoose");
//GET BLOOD DATA
const bloodGroupDetailsContoller = async (req, res) => {
  try {
    const bloodGroups = ["O+", "O-", "AB+", "AB-", "A+", "A-", "B+", "B-"];
    const bloodGroupData = [];
    const organisation = new mongoose.Types.ObjectId(req.body.userId);
    //get single blood group
    await Promise.all(
      bloodGroups.map(async (bloodGroup) => {
        //Count  TOTAL BLOOD IN
        const totalIn = await inventoryModel.aggregate([
          {
            $match: {
              bloodGroup: bloodGroup,
              inventoryType: "in",
              organisation,
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$quantity" },
            },
          },
        ]);
        //Count TOTAL OUT
        const totalOut = await inventoryModel.aggregate([
          {
            $match: {
              bloodGroup: bloodGroup,
              inventoryType: "out",
              organisation,
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$quantity" },
            },
          },
        ]);
        //CALCULATE TOTAL
        const availabeBlood =
          (totalIn[0]?.total || 0) - (totalOut[0]?.total || 0);

        //PUSH DATA
        bloodGroupData.push({
          bloodGroup,
          totalIn: totalIn[0]?.total || 0,
          totalOut: totalOut[0]?.total || 0,
          availabeBlood,
        });
      })
    );

    return res.status(200).send({
      success: true,
      message: "Blood Group Data Fetch Successfully",
      bloodGroupData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Bloodgroup Data Analytics API",
      error,
    });
  }
};

const getPublicStatsController = async (req, res) => {
  try {
    const userModel = require("../models/userModel");

    // 1. Calculate Total Donors
    const activeDonors = await userModel.countDocuments({ role: "donar" });

    // 2. Calculate Partner Hospitals
    const partnerHospitals = await userModel.countDocuments({ role: "hospital" });

    // 3. Calculate Lives Saved (assuming 1 unit of blood saves 3 lives)
    // We sum the 'in' inventory quantity. If it's in ML, typically 350ml = 1 unit = 3 lives.
    // If it's units, just * 3. We'll use a conservative estimate: total_in_quantity / 350 * 3
    // Or just count total successful 'in' requests if quantity isn't standard.
    // Let's sum quantity.
    const totalIn = await inventoryModel.aggregate([
      { $match: { inventoryType: "in" } },
      { $group: { _id: null, total: { $sum: "$quantity" } } }
    ]);
    
    let totalQuantity = totalIn[0]?.total || 0;
    // Assuming quantity is in ML (e.g. 350ml or 450ml per donation)
    // If quantity is small (e.g. 1, 2 units), this logic will adapt.
    // If average quantity > 100, we treat it as ML, else as Units.
    let livesSaved = 0;
    if (totalQuantity > 100) {
      livesSaved = Math.floor((totalQuantity / 350) * 3);
    } else {
      livesSaved = totalQuantity * 3;
    }

    return res.status(200).send({
      success: true,
      stats: {
        livesSaved,
        partnerHospitals,
        activeDonors
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in public stats API",
      error
    });
  }
};

module.exports = { bloodGroupDetailsContoller, getPublicStatsController };
