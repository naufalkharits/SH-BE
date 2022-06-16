const express = require("express");
const router = require("./routes/index.route");
const app = express();
const path = require("path");
const cors = require("cors");
const swaggerJSON = require("./swagger.json");
const swaggerUI = require("swagger-ui-express");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerJSON));

app.use(router);

app.listen(process.env.PORT || 8000, async () => {
  console.log("Listening on 8000");
});
