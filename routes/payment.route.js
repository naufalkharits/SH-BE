"use strict"

const router = require("express").Router()

const InvoiceController = require("../controllers/payment.controller")
const invoiceController = new InvoiceController()

router.post("/invoice", async (req, res) => {
  try {
    // you can change the config with your business details
    const data = {
      payer_email: "invoice+demo@xendit.co",
      description: "Checkout Demo",
      external_id: `checkout-demo-${+new Date()}`,
      currency: req.body.currency,
      amount: req.body.amount,
      failure_redirect_url: req.body.redirect_url,
      success_redirect_url: req.body.redirect_url,
    }

    const invoice = await invoiceController.create(data)
    return res
      .setHeader("Content-Type", "application/json;charset=utf-8")
      .status(200)
      .send(invoice.data)
  } catch (e) {
    return res.status(500).json({
      type: "SYSTEM_ERROR",
      message: "Something wrong with server",
    })
  }
})

module.exports = router
