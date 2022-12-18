require("dotenv").config()
const Xendit = require("xendit-node")

const { Transaction, Product } = require("../models")

const x = new Xendit({
  secretKey: `${process.env.PAYMENT_SECRET_API_KEY}`,
})
const { Invoice } = x
const invoiceSpecificOptions = {}
const i = new Invoice(invoiceSpecificOptions)

module.exports = {
  createInvoice: async (req, res) => {
    try {
      const transaction = await Transaction.findOne({
        where: { id: req.body.external_id },
      })

      if (transaction.status !== "ACCEPTED") {
        return res.status(404).json({
          type: "NOT_FOUND",
          message: "Transaction not found",
        })
      }

      const data = {
        externalID: req.body.external_id,
        amount: req.body.amount,
        fees: [
          {
            type: "ADMIN",
            value: 5000,
          },
        ],
        customer: {
          email: req.body.email,
          mobile_number: `+${req.body.mobile_number}`,
        },
        customer_notification_preference: {
          invoice_created: ["email"],
          invoice_reminder: ["email"],
          invoice_paid: ["email"],
          invoice_expired: ["email"],
        },
        invoiceDuration: 120,
        successRedirectURL: req.body.redirect_url,
        failureRedirectURL: req.body.redirect_url,
      }

      const response = await i.createInvoice(data)

      await Transaction.update(
        {
          status: "WAIT FOR PAYMENT",
          expiry_date: response.expiry_date,
          invoice_id: response.id,
          invoice_url: response.invoice_url,
        },
        {
          where: {
            id: response.external_id,
          },
        }
      )

      return res.status(200).json({ invoice: response })
    } catch (error) {
      return res.status(500).json({ type: "SYSTEM_ERROR", message: "Something wrong with server" })
    }
  }
}
