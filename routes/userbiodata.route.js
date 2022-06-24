const router = require("express").Router();
const controller = require("../controllers/userbiodata.controller");

router.get("/:id", controller.getuserbiodata);

module.exports = router;
