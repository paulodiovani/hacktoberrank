const express = require("express");

const app = express();

app.get("/", function(req, res) {
  res.send("hello world");
});

const port = 8001;

app.listen(port, () =>
  console.log(`backend service listening at port ${port}`)
);
