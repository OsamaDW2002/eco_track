const express = require('express')
require("express-session");
const app = express()
const userProfileRoutes = require('./routers/user_profile')
const uploadRoutes = require("./routers/upload");
const alertRouts = require("./routers/alert");
const concernRouts = require("./routers/concern");
app.use(express.json());




app.use("/user_profile", userProfileRoutes)
app.use("/uploads", uploadRoutes)
app.use("/alerts", alertRouts)
app.use("/concerns", concernRouts)
app.listen(6005)
