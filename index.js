const express = require("express");
const router = require("./routes/index.route");
const app = express();
const path = require("path");
const cors = require("cors");
const fs = require("fs");

if (!fs.existsSync(path.join(__dirname, "public", "images"))) {
  fs.mkdirSync(path.join(__dirname, "public", "images"), {
    recursive: true,
  });
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(router);

app.listen(process.env.PORT || 8000, async () => {
  console.log("Listening on 8000");
});
