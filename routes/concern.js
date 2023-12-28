const {Router} = require("express");
const {authenticateTokenHandler} = require("../methods/auth");
const {addConcern,listAllConcerns} = require("../methods/concerns/concerns_curd");

const concernRouts = Router()

concernRouts.post("/add/:concern", authenticateTokenHandler, addConcern)
concernRouts.get("/", authenticateTokenHandler, listAllConcerns)
 module.exports = concernRouts