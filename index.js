const express = require('express')
require("express-session");
const app = express()
const userProfileRoutes = require('./routers/user_profile')
const uploadRoutes = require("./routers/upload");

app.use(express.json());

app.use("/user_profile", userProfileRoutes)
app.use("/upload", uploadRoutes)

app.listen(6005)