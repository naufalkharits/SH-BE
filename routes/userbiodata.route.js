const router = require("express").Router();
const controller = require("../controllers/userbiodata.controller");
const multer = require("multer");

router.get("/:id", controller.getBiodata);
router.put("/:id", multer().single("picture"), controller.updateBiodata);
module.exports = router;
