"use strict"

const router = require("express").Router()

const InvoiceController = require("../controllers/payment.controller")
const invoiceController = new InvoiceController()

router.get("/healthcheck/readiness", (req, res) => {
  res.json({
    status: "ok",
  })
})

router.post("/invoice", async (req, res) => {
  try {
    // you can change the config with your business details
    const data = {
      ...config.invoiceData,
      external_id: `checkout-demo-${+new Date()}`,
      currency: req.body.currency,
      amount: req.body.amount,
      failure_redirect_url: req.body.redirect_url,
      success_redirect_url: req.body.redirect_url,
    }

    const invoice = await invoiceController.create(data)
    return res.status(200).send(invoice.data)
  } catch (e) {
    return res.status(e.res.status).send(e.res.data)
  }
})

module.exports = router
