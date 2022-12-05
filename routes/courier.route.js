const courierController = require("../controllers/courier.controller")

const router = require("express").Router()

router.get("/province", courierController.getProvinces)
router.post("/city", courierController.getCities)

module.exports = router
