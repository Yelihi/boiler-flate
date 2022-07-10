const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://Yelihi:dnjsdlr1@boilerflate.jc2sl.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World!")); // root 디렉토리에 오면 문구를 띄우도록 한다.

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
