const { Category } = require("../models");

module.exports = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.findAll();

      if (categories.length > 0) {
        res.status(200).json({ categories });
      } else {
        res.status(404).json({
          type: "NOT_FOUND",
          message: "Categories not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },
};
