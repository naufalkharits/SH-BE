const express = require("express");
const productRoutes = require("./routes/product");

const app = express();

app.use("/product", productRoutes);

app.listen(8000, async () => {
  console.log("Listening on 8000");
});
