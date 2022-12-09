const axios = require("axios")

module.exports = {
  getProvinces: async (req, res) => {
    try {
      const response = await axios.get(`${process.env.COURIER_API_URL}/province`, {
        headers: {
          key: `${process.env.COURIER_API_KEY}`,
        },
      })
      res.json(response.data)
    } catch (error) {
      res.send(error)
    }
  },
  getCities: async (req, res) => {
    try {
      const response = await axios.get(`/city?province=${req.body.provinceId}`, {
        headers: {
          key: `${process.env.COURIER_API_KEY}`,
        },
      })
      res.json(response.data)
    } catch (error) {
      res.send(error)
    }
  },
  getCosts: async (req, res) => {
    try {
      const response = await axios.post(
        "/cost",
        {
          origin: req.body.origin,
          destination: req.body.destination,
          weight: req.body.weight,
          courier: req.body.courier,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            key: `${process.env.COURIER_API_KEY}`,
          },
        }
      )
      res.json(response.data)
    } catch (error) {
      res.send(error)
    }
  },
}
