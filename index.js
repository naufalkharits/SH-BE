const express = require("express");
const router = require("./routes/index.route");
const app = express();

app.use(express.json());

app.use(router);

app.listen(8000, async () => {
  console.log("Listening on 8000");
});
