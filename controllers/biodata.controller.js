const { UserBiodata } = require("../models");
const { uploadProfileImage, validatePicture } = require("../utils/picture");

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
      res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },
  updateBiodata: async (req, res) => {
    const { name, city, address, phone_number } = req.body;

    const profilePicture = req.file;

    try {
      // Update Profile Image
      if (profilePicture) {
        try {
          validatePicture(profilePicture);
        } catch (error) {
          return res.status(400).json({
            type: "VALIDATION_FAILED",
            message: error.message,
          });
        }

        await uploadProfileImage(profilePicture, req.user.id);
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
            user_id: req.user.id,
          },
        }
      );

      // get Updated Biodata
      const biodata = await UserBiodata.findOne({
        where: { user_id: req.user.id },
      });

      res.status(200).json({ updatedBiodata: biodata });
    } catch (err) {
      res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },
};
