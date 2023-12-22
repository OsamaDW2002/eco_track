const express = require('express')
require("express-session");
const app = express()
const userProfileRoutes = require('./routers/user_profile')
const uploadRoutes = require("./routers/upload");
const moment = require("moment/moment");

app.use(express.json());
console.log("currentTime");

const currentTime=moment();
console.log(currentTime);

app.use("/user_profile", userProfileRoutes)
app.use("/upload", uploadRoutes)

app.listen(6005)