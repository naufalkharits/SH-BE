const router = require("express").Router()
const paymentController = require("../controllers/payment.controller")

router.post("/snap", paymentController.getSnap)
// router.post("/invoice", paymentController.getInvoice)
router.post("/webhook", paymentController.webhookMidtrans)
router.post("/timer", paymentController.txTimer)

module.exports = router
