const express = require('express')
require("express-session");
const app = express()
const router = require('./routers/user_profile')
const uploadRoutes = require("./routers/upload");
app.use(express.json());
app.use("/user_profile", router)
app.use("/upload",uploadRoutes)
app.listen(6005)