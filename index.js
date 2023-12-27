const express = require('express')
const functions=require('firebase-functions/v2')
 const app = express()
const userProfileRoutes = require('./routers/profile')
const uploadRoutes = require("./routers/upload");
const alertRouts = require("./routers/alert");
const concernRouts = require("./routers/concern");
 app.use(express.json());




app.use("/profile", userProfileRoutes)
app.use("/uploads", uploadRoutes)
app.use("/alerts", alertRouts)
app.use("/concerns", concernRouts)
  exports.eco_track=functions.https.onRequest({region:'me-west1',maxInstances:10},app)