require("dotenv").config()
const Xendit = require("xendit-node")

const x = new Xendit({
  secretKey: `${process.env.PAYMENT_SECRET_API_KEY}`,
})
const { Invoice } = x
const invoiceSpecificOptions = {}
const i = new Invoice(invoiceSpecificOptions)

module.exports = {
  getInvoice: async (req, res) => {
    try {
      const data = {
        externalID: `checkout-demo-${+new Date()}`,
        amount: req.body.amount,
        successRedirectURL: req.body.redirect_url,
        failureRedirectURL: req.body.redirect_url,
      }

      const response = await i.createInvoice(data)
      return res.status(200).json({ invoice: response })
    } catch (error) {
      res.status(500).json({ type: "SYSTEM_ERROR", message: "Something wrong with server" })
    }
  },
}
