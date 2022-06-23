const router = require("express").Router();
const controller = require("../controllers/userbiodata.controller");

router.get("/:id", controller.getUserBiodata);

module.exports = router;
