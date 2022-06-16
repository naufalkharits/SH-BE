const express = require("express");
const router = require("./routes/index.route");
const app = express();
const path = require("path");
const cors = require("cors");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cors());

app.use(router);

app.listen(process.env.PORT || 8000, async () => {
  console.log("Listening on 8000");
});
