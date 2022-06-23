const { userbiodata } = require("../models");

module.exports = {
  getuserbiodata: async (req, res) => {
    if (!req.params || !req.params.id || !Number.isInteger(+req.params.id)) {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message: "Valid User Biodata ID is required",
      });
    }

    try {
      // Get User Biodata
      const userbiodata = await UserBiodata.findOne({
        where: {
          user_id: req.params.user_id,
        },
      });

      // Check if user biodata not found
      if (!userbiodata) {
        return res.status(404).json({
          type: "NOT_FOUND",
          message: "User Biodata not found",
        });
      }

      // Get User Biodata filename
      const userbiodataData = {
        user_id: product.user_id,
        name: product.name,
        city: product.city,
        address: product.address,
        phone_number: product.phone_number,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };

      res.status(200).json({
        userbiodata: userbiodataData,
      });
    } catch (error) {
      res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },
};
