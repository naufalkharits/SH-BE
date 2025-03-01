const router = require("express").Router()
const paymentController = require("../controllers/payment.controller")

router.post("/snap", paymentController.getSnap)
// router.post("/invoice", paymentController.getInvoice)
router.post("/webhook", paymentController.webhookMidtrans)

module.exports = router
