const router = require("express").Router();
const controller = require("../controllers/biodata.controller");
const multer = require("multer");
const checkAuth = require("../middlewares/check-auth");

router.get("/:id", controller.getBiodata);
router.put(
  "/",
  checkAuth,
  multer().single("picture"),
  controller.updateBiodata
);
module.exports = router;
