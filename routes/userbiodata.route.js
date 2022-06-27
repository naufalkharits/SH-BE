const router = require("express").Router();
const controller = require("../controllers/userbiodata.controller");

router.get("/:id", controller.getBiodata);

module.exports = router;
