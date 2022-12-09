"use strict"

require("dotenv").config()
const axios = require("axios")

class InvoiceController {
  constructor() {
    ;(this.url = process.env.PAYMENT_GATEWAY_API_URL + "/v2/invoices"),
      (this.headers = {
        "Content-Type": "application/json",
      }),
      (this.auth = {
        username: process.env.PAYMENT_SECRET_API_KEY,
        password: "",
      })
    this.timeout = 10000
  }

  async create(data) {
    const options = {
      method: "POST",
      headers: this.headers,
      timeout: this.timeout,
      auth: this.auth,
      url: this.url,
      data,
    }

    try {
      return await axios(options)
    } catch (e) {
      throw e
    }
  }
}

module.exports = InvoiceController
