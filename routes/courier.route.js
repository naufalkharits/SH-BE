const courierController = require("../controllers/courier.controller")

const router = require("express").Router()

router.get("/province", courierController.getProvinces)
router.get("/cost/:origin/:destination/:weight/:courier", courierController.getCosts)
router.post("/city", courierController.getCities)

module.exports = router
