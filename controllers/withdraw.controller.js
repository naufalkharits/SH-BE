const { Withdraw } = require("../models")

module.exports = {
  createWithdraw: async (req, res) => {
    try {
      await Withdraw.create({
        transaction_id: req.body.transaction_id,
        status: "PENDING",
        no_rek: req.body.no_rek,
      })

      return res.status(200).send("OK")
    } catch (error) {
      return res.status(500).json({ type: "SYSTEM_ERROR", message: "Something wrong with server" })
    }
  },
}
