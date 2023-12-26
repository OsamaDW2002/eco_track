const {Router} = require("express");
const {authenticateTokenHandler} = require("../methods/auth");
const {uploadData, removeData} = require("../methods/upload/data_upload");
const {uploadReport, removeReport} = require("../methods/upload/report_upload");
const {removeResource, uploadResource, updateResource} = require("../methods/upload/resource_upload");
const uploadRoutes = Router();

uploadRoutes.post('/data', authenticateTokenHandler, uploadData)
uploadRoutes.delete('/data/remove/:id',authenticateTokenHandler,removeData)
uploadRoutes.post("/report", authenticateTokenHandler, uploadReport)
uploadRoutes.delete("/report/remove/:title",authenticateTokenHandler,removeReport)
uploadRoutes.delete("/resources/remove/:name",authenticateTokenHandler,removeResource)
uploadRoutes.post("/resources",authenticateTokenHandler,uploadResource)
uploadRoutes.patch("/resources",authenticateTokenHandler,updateResource)
module.exports = uploadRoutes