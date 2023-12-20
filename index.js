const express = require('express')
require("express-session");
const app = express()
const router = require('./Router/user_profile')
app.use(express.json());
app.use("/user_profile", router)

app.listen(6005)