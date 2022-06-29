const { UserBiodata, User } = require("../models");
const { uploadProfileImage } = require("../utils/picture");

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
    if (!req.params.id || !Number.isInteger(+req.params.id)) {
      return res.status(400).json({
        type: "VALIDATION_VAILED",
        message: "Valid Biodata ID is required",
      });
    }

    const { name, city, address, phone_number } = req.body;

    const profilePicture = req.file;

    try {
      console.log("User ID : ", req.params.id);
      // Find biodata id if biodata updated
      const user = await User.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!user) {
        return res.status(400).json({
          type: "VALIDATON_FAILED",
          message: "Valid User ID is required",
        });
      }

      // Update Profile Image
      if (profilePicture) {
        await uploadProfileImage(profilePicture, req.params.id);
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

      res.status(200).json({ updatedBiodata: biodata });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },
};
