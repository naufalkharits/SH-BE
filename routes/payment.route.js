const router = require("express").Router()
const paymentController = require("../controllers/payment.controller")

router.post("/invoice/webhook", paymentController.webhookInvoice)
router.post("/invoice", paymentController.createInvoice)

module.exports = router
