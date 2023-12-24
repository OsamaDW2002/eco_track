const {Router} = require("express");
const {authenticateTokenHandler} = require("../methods/user_profile/auth");
const {setAlert, removeAlert} = require("../methods/alert/alert_curd");

const alertRouts=Router()

alertRouts.post("/set",authenticateTokenHandler,setAlert)
alertRouts.delete("/remove/:name",authenticateTokenHandler,removeAlert)
module.exports=alertRouts;