const {Router} = require("express");
const {authenticateTokenHandler} = require("../methods/auth");
const {setAlert, removeAlert, getAlerts, getAlertByName} = require("../methods/alert/alert_curd");

const alertRouts=Router()

alertRouts.post("/set",authenticateTokenHandler,setAlert)
alertRouts.delete("/remove/:name",authenticateTokenHandler,removeAlert)
alertRouts.get("/get",authenticateTokenHandler,getAlerts)
alertRouts.get("/get/:name",authenticateTokenHandler,getAlertByName)
module.exports=alertRouts;