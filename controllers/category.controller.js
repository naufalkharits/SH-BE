const { Category } = require("../models");

module.exports = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.findAll();

      const categoriesData = categories.map((category) => category.name);
      res.status(200).json({ categories: categoriesData });
    } catch (error) {
      res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },
};
