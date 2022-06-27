const { UserBiodata } = require("../models");

module.exports = {
  getBiodata: async (req, res) => {
    if (!req.params || !req.params.id || !Number.isInteger(+req.params.id)) {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message: "Valid User Biodata ID is required",
      });
    }

    try {
      // Get User Biodata
      const biodata = await UserBiodata.findOne({
        where: {
          user_id: req.params.id,
        },
      });

      // Check if user biodata not found
      if (!biodata) {
        return res.status(404).json({
          type: "NOT_FOUND",
          message: "User Biodata not found",
        });
      }

      res.status(200).json({
        biodata,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },
};
