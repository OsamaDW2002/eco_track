const {Router} = require("express");
const {authenticateTokenHandler} = require("../methods/auth");
const addConcern = require("../methods/concerns/add_concern");

const concernRouts = Router()

concernRouts.get("/add/:concern", authenticateTokenHandler, addConcern)
 module.exports = concernRouts