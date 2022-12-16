const router = require("express").Router()
const paymentController = require("../controllers/payment.controller")

router.post("/invoice", paymentController.getInvoice)
router.post("/invoice/webhook", paymentController.webhookInvoice)

module.exports = router
