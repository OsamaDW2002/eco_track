const {Router} = require("express");
const {authenticateTokenHandler} = require("../methods/user_profile/auth");
const {uploadData} = require("../methods/upload/data_upload");
const {uploadReport} = require("../methods/upload/report_upload");
const uploadRoutes = Router();

uploadRoutes.post('/data', authenticateTokenHandler, uploadData)
uploadRoutes.post("/report", authenticateTokenHandler, uploadReport)
module.exports = uploadRoutes