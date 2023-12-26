const {login, registerNewAccount} = require('../methods/user_profile/user_profile_methods.js');
const {Router} = require("express");
const {authenticateTokenHandler} = require("../methods/auth");
const {top5Concerns} = require("../methods/user_profile/searching_about/concerns");
const {scoreboard, findSpecificUser} = require("../methods/user_profile/searching_about/other_users");
const {getAllReports, getSpecificReport} = require("../methods/user_profile/searching_about/reports");
const {getAllResources, getSpecificResource} = require("../methods/user_profile/searching_about/resources");
const userProfileRouts = Router();


userProfileRouts.post('/register',registerNewAccount);
userProfileRouts.post('/login', login);

userProfileRouts.get('/search/scoreboard',authenticateTokenHandler,scoreboard);
userProfileRouts.get('/search/:email',authenticateTokenHandler, findSpecificUser);

userProfileRouts.get('/search/concerns',authenticateTokenHandler,top5Concerns);

userProfileRouts.get('/search/reports',authenticateTokenHandler,getAllReports);
userProfileRouts.get('/search/reports/:title',authenticateTokenHandler, getSpecificReport);

userProfileRouts.get('/search/resource',authenticateTokenHandler,getAllResources);
userProfileRouts.get('/search/resource/:email',authenticateTokenHandler, getSpecificResource);

module.exports = userProfileRouts