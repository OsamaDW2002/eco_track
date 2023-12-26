const {login, registerNewAccount} = require('../methods/user_profile/user_profile_methods.js');
const {Router} = require("express");
const {authenticateTokenHandler} = require("../methods/auth");
// const {top5Concerns} = require("../methods/user_profile/searching_about/concerns");
const {scoreboard, findSpecificUser} = require("../methods/user_profile/searching_about/other_users");
const userProfileRouts = Router();


userProfileRouts.post('/register',registerNewAccount);
userProfileRouts.get('/scoreboard',authenticateTokenHandler,scoreboard);
userProfileRouts.get('/search/:email',authenticateTokenHandler, findSpecificUser);
userProfileRouts.post('/login', login);

module.exports = userProfileRouts