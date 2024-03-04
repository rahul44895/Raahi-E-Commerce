const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const path = require('path')
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGOURI)
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((error) => console.log(error));

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use('/',express.static(path.join(__dirname,'./client/build')));
app.use(express.static("uploads"));

app.use("/api/userRoute", require("./routes/userRoute"));
app.use("/api/productRoute", require("./routes/productRoute"));
app.use("/api/orderRoute", require("./routes/orderRoute"));

app.listen(process.env.PORT, () => {
  console.log(`App is listening on port ${process.env.PORT}`);
});
