const router = require("express").Router()
const withdrawController = require("../controllers/withdraw.controller")

router.post("/dana", withdrawController.createWithdraw)

module.exports = router
