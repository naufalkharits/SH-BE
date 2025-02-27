const axios = require("axios")

module.exports = {
  getProvinces: async (req, res) => {
    try {
      const response = await axios.get(`${process.env.COURIER_API_URL}/province`, {
        headers: {
          key: `${process.env.COURIER_API_KEY}`,
        },
      })
      res.status(200).json(response.data)
    } catch (error) {
      res.status(500).json({ type: "SYSTEM_ERROR", message: "Something wrong with server" })
    }
  },
  getCities: async (req, res) => {
    try {
      console.log(req.body)
      console.log(req.body.provinceId)
      const response = await axios.get(
        `${process.env.COURIER_API_URL}/city?province=${req.body.provinceId}`,
        {
          headers: {
            key: `${process.env.COURIER_API_KEY}`,
          },
        }
      )
      res.status(200).json(response.data)
    } catch (error) {
      res.send(error)
    }
  },
  getCosts: async (req, res) => {
    try {
      const response = await axios.post(
        `${process.env.COURIER_API_URL}/cost`,
        {
          origin: req.body.origin,
          destination: req.body.destination,
          weight: req.body.weight,
          courier: req.body.courier,
        },
        {
          headers: {
            key: `${process.env.COURIER_API_KEY}`,
          },
        }
      )
      res.json(response.data)
    } catch (error) {
      res.status(500).json({ type: "SYSTEM_ERROR", message: "Something wrong with server" })
    }
  },
}
