const express = require('express')
const app = express()
const userProfileRoutes = require('./routes/profile')
const uploadRoutes = require("./routes/uploads");
const alertRouts = require("./routes/alerts");
const concernRouts = require("./routes/concern");
 app.use(express.json());




app.use("/profile", userProfileRoutes)
app.use("/uploads", uploadRoutes)
app.use("/alerts", alertRouts)
app.use("/concerns", concernRouts)

app.listen(8046)