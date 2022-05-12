const express = require("express");
const cors = require("cors");
const app = express();
const fs = require("fs");
const path = require("path");

app.use(express.json());
app.use(cors());

fs.readdirSync("./routes").map((r) => {
  app.use("/api", require("./routes/" + r));
});
const port = 2000;
app.listen(port, () => {
  console.log("SERVER IS UP " + port);
});
