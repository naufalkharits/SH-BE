const express = require("express")
const router = require("./routes/index.route")
const app = express()
const path = require("path")
const swaggerJSON = require("./swagger.json")
const swaggerUI = require("swagger-ui-express")
const firebase = require("./utils/firebase")
const socket = require("./utils/socket")
require("./utils/passport-jwt")

firebase.setup()

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  if (req.method == "OPTIONS") {
    return res.sendStatus(200)
  } else {
    next()
  }
})

app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerJSON))

app.use(router)

const server = app.listen(process.env.PORT || 8000, async () => {
  console.log(`Listening on ${process.env.PORT || 8000}`)
})

socket.init(server)

module.exports = { app, server }
