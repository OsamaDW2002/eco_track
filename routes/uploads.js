const { Router } = require("express");
const { authenticateTokenHandler } = require("../methods/auth");
const { uploadData, removeData } = require("../methods/upload/data_upload");
const {uploadReport, removeReport, updateReport} = require("../methods/upload/report_upload");
const {removeResource, uploadResource, updateResource} = require("../methods/upload/resource_upload");
const {getAllReports, getSpecificReport, getReportsByConcern, searchReportsByTextOrLocation} = require("../methods/upload/search_and_retrieval/reports");
const {getSpecificResource, getAllResources, getResourcesByConcern} = require("../methods/upload/search_and_retrieval/resources");
const {getDataById, getDataByConcern, searchDataByTextOrLocation} = require("../methods/upload/search_and_retrieval/data");

const uploadRoutes = Router();

uploadRoutes.post('/data', authenticateTokenHandler, uploadData);
uploadRoutes.delete('/data/:id', authenticateTokenHandler, removeData);
uploadRoutes.get("/data/:id", authenticateTokenHandler, getDataById);
uploadRoutes.get("/data/concern/:concern", authenticateTokenHandler, getDataByConcern);
uploadRoutes.get("/search/data/",authenticateTokenHandler,searchDataByTextOrLocation)

uploadRoutes.post("/reports", authenticateTokenHandler, uploadReport);
uploadRoutes.delete("/reports/:title", authenticateTokenHandler, removeReport);
uploadRoutes.patch("/reports", authenticateTokenHandler, updateReport);
uploadRoutes.get("/reports", authenticateTokenHandler, getAllReports);
uploadRoutes.get("/reports/:title", authenticateTokenHandler, getSpecificReport);
uploadRoutes.get("/reports/concern/:concern", authenticateTokenHandler, getReportsByConcern);
uploadRoutes.get("/search/reports/",authenticateTokenHandler,searchReportsByTextOrLocation)

uploadRoutes.delete("/resources/:name", authenticateTokenHandler, removeResource);
uploadRoutes.post("/resources", authenticateTokenHandler, uploadResource);
uploadRoutes.patch("/resources", authenticateTokenHandler, updateResource);
uploadRoutes.get("/resources", authenticateTokenHandler, getAllResources);
uploadRoutes.get("/resources/:name", authenticateTokenHandler, getSpecificResource);
uploadRoutes.get("/resources/concern/:concern", authenticateTokenHandler, getResourcesByConcern);

module.exports = uploadRoutes;
