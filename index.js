const port = 6005
const express=require('express')
const session = require("express-session");
const app=express()
const router=require('./Router/user_profile')
const {authenticateToken} = require("./user_profile/auth");
app.use(express.json());
app.use("/user_profile",router)

app.listen(6005)