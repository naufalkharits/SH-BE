const { Category } = require("../models");

module.exports = {
  getCategory: (req, res) => {
    Category.findAll()
      .then((category) => {
        if (category.length > 0) {
          res.status(200).json({ message: "Success Get Category", data: category });
        } else {
          res.status(404).json({ message: "Category Not Found", data: category });
        }
      })
      .catch((err) => {
        res.status(500).json({
          type: "SYSTEM_ERROR",
          message: "Something wrong with server",
        });
      });
  },
};
