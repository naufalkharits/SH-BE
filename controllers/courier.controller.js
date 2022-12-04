const axios = require("axios")

axios.defaults.baseURL = `${process.env.COURIER_API_URL}`
axios.defaults.headers.common["key"] = `${process.env.COURIER_API_KEY}`
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded"

module.exports = {
  getProvinces: async (req, res) => {
    try {
      const response = await axios.get("/province")
      res.json(response.data)
    } catch (error) {
      res.send(error)
    }
  },
}
