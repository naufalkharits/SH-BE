const router = require("express").Router();
const controller = require("../controllers/category.controller");

router.get("/", controller.getCategories);

module.exports = router;
