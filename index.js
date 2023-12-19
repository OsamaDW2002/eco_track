const port = 6005
const express=require('express')
const session = require("express-session");
const app=express()
const router=require('./Router/user_profile')
app.use(session({
    secret: 'secret-key',
    saveUninitialized:false,
    resave: false,
    cookie: { maxAge: 60 * 1000 }
}));
app.use(express.json());
app.use("/user_profile",router)

app.listen(6005)