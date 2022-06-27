const { UserBiodata, User } = require("../models");

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
  updateBiodata: async (req, res) => {
    // check if biodata id is valid
    if (!Number.isInteger(+req.params.id)) {
      return res.status(400).json({
        type: "VALIDATION_VAILED",
        message: "Valid Biodata ID is required",
      });
    }

    const { user_id, name, city, address, phone_number } = req.body;

    try {
      // Find biodata id if biodata updated
      const userBiodata = await User.findOne({
        where: {
          id: user_id || null,
        },
      });

      if (user_id && !userBiodata) {
        return res.status(400).json({
          type: "VALIDATON_FAILED",
          message: "Valid Biodata ID is required",
        });
      }

      // Update Biodata
      await UserBiodata.update(
        {
          name: name,
          city: city,
          address: address,
          phone_number: phone_number,
        },
        {
          where: {
            user_id: req.params.id,
          },
        }
      );

      // get Updated Biodata
      const biodata = await UserBiodata.findOne({
        where: { user_id: req.params.id },
      });

      if (!biodata) {
        return res.status(404).json({
          type: "NOT_FOUND",
          message: "User Biodata Not Found",
        });
      }

      const updatedBiodata = {
        id: biodata.id,
        name: biodata.name,
        city: biodata.city,
        address: biodata.address,
        phone_number: biodata.phone_number,
        createdAt: biodata.createdAt,
        updateAt: biodata.updateAt,
      };
      res.status(200).json({ message: "Biodata Updated!", updatedBiodata });
    } catch (err) {
      res.status(500).json({
        type: "SYSTEM _ERROR",
        message: "Something wrong with server",
      });
    }
  },
};
