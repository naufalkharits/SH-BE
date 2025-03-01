require("dotenv").config()
const axios = require("axios")
const midtransClient = require('midtrans-client');

// const Xendit = require("xendit-node")

const { Transaction, Product, Notification} = require("../models")

// const x = new Xendit({
//   secretKey: `${process.env.PAYMENT_SECRET_API_KEY}`,
// })
// const { Invoice } = x
// const invoiceSpecificOptions = {}
// const i = new Invoice(invoiceSpecificOptions)

module.exports = {
  getSnap: async (req, res) => {
    try {
      // Create Snap API instance
      const snap = new midtransClient.Snap({
        // Set to true if you want Production Environment (accept real transaction).
        isProduction : false,
        serverKey : process.env.MIDTRANS_SERVER_KEY
      })

      const parameter = {
        "transaction_details": {
          "order_id": req.body.order_id,
          "gross_amount": req.body.amount
        },
        "credit_card":{
          "secure" : true
        },
        "customer_details": {
          "first_name": "sandbox_firstname",
          "last_name": "sandbox_lastname",
          "email": req.body.email,
          "phone": `+${req.body.mobile_number}`
        }
      }

      snap.createTransaction(parameter).then(async (tx)=>{
        // transaction token
        const transactionToken = tx.token

        const transaction = await Transaction.findOne({
          where: { id: req.body.order_id },
        })
        
        // input token to Transaction table
        await Transaction.update(
          {
            status: "WAIT FOR PAYMENT",
            snap_token: transactionToken,
          },
          {
            where: {
              id: req.body.order_id,
            },
          }
        )

        await axios.post(`${process.env.HOOKDECK_WAIT_FOR_PAYMENT}`, {
          order_id: transaction.id,
          product_id: transaction.product_id,
          type: "WAIT_FOR_PAYMENT"
        })

        return res.status(200).json({ transactionToken })
      })    
    } catch (error) {
      return res.status(500).json({ type: "SYSTEM_ERROR", message: "Something wrong with server" })
    }
  },

  webhookMidtrans: async (req, res) => {
    try {
      const transaction = await Transaction.findOne({
        where: { id: req.body.order_id },
      })
      
      if (req.body.transaction_status === "settlement") {
        console.log("check 0")

        await Transaction.update(
          {
            status: "PAID",
          },
          {
            where: {
              id: req.body.order_id,
            },
          }
        )

        console.log(process.env.HOOKDECK_TRANSACTION_PAID)
        
        await axios.post(`${process.env.HOOKDECK_TRANSACTION_PAID}`, {
          order_id: transaction.id,
          product_id: transaction.product_id,
          type: "TRANSACTION_PAID"
        })
        
        console.log("check 1")
        
        await Product.update(
          {
            status: "SOLD",
          },
          {
            where: {
              id: transaction.product_id,
            },
          }
        )
        
        console.log("check 2")
      }

      res.status(200).send("OK")
    } catch (error) {
      return res.status(500)
    }
  },
  
  txTimer: async (req, res) => {
    try {
      const transaction = await Transaction.findOne({
        where: { id: req.body.order_id },
      })

        console.log("ACCEPTED || PAID")

        if (transaction.status === "ACCEPTED" && req.body.type === "TRANSACTION_ACCEPTED") {
          console.log("TRANSACTION_ACCEPTED TIMER")

          await Transaction.update(
            {
              status: "EXPIRED",
            },
            {
              where: {
                id: req.body.order_id,
              },
            }
          )

          await Notification.create({
            type: "TRANSACTION_EXPIRED",
            user_id: transaction.buyer_id,
            transaction_id: transaction.id,
          });
        }

        if (transaction.status === "PAID" && req.body.type === "TRANSACTION_PAID") {
          console.log("TRANSACTION_PAID TIMER")

          await Transaction.update(
            {
              status: "REFUNDED",
            },
            {
              where: {
                id: req.body.order_id,
              },
            }
          )

          await Notification.create({
            type: "TRANSACTION_REFUNDED",
            user_id: transaction.buyer_id,
            transaction_id: transaction.id,
          });

          await axios.post(`${process.env.MIDTRANS_API_URL}/${req.body.order_id}/refund/online/direct`)
        }

        await Product.update(
          {
            status: "READY",
          },
          {
            where: {
              id: transaction.product_id,
            },
          }
        )

      if (transaction.status === "WAIT FOR PAYMENT" && req.body.type === "WAIT_FOR_PAYMENT") {
        await Transaction.update(
          {
            status: "EXPIRED",
          },
          {
            where: {
              id: req.body.order_id,
            },
          }
        );

        await Product.update(
          {
            status: "READY",
          },
          {
            where: {
              id: transaction.product_id,
            },
          }
        )

        await Notification.create({
          type: "TRANSACTION_EXPIRED",
          user_id: transaction.buyer_id,
          transaction_id: transaction.id,
        });
      }

      res.status(200).send("OK")
    } catch (error) {
      return res.status(500)
    }
  }
}
