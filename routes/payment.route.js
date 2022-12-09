const router = require("express").Router()
const paymentController = require("../controllers/payment.controller")

router.post("/invoice", paymentController.getInvoice)

module.exports = router
