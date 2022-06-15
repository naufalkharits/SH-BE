const express = require("express");
const router = require("./routes/index.route");
const app = express();
const path = require("path");
const { deleteAllPictures } = require("./utils/picture");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use(router);

app.listen(process.env.PORT || 8000, async () => {
  deleteAllPictures();
  console.log("Listening on 8000");
});
