const express = require("express");
const router = require("./routes");
const app = express();

app.use(router);

app.listen(8000, async () => {
  console.log("Listening on 8000");
});
