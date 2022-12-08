const courierController = require("../controllers/courier.controller")

const router = require("express").Router()

router.get("/province", courierController.getProvinces)
router.post("/city", courierController.getCities)
router.post("/cost", courierController.getCosts)

module.exports = router
