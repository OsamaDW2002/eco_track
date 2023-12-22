const {login, registerNewAccount} = require('../methods/user_profile/user_profile_methods.js');
const {Router} = require("express");
const {authenticateTokenHandler} = require("../methods/user_profile/auth");
const userProfileRouts = Router();


userProfileRouts.post('/register',registerNewAccount);
userProfileRouts.post('/login', login);
userProfileRouts.get('/signed_test',authenticateTokenHandler,(req, res) => {
    res.send(`Hello, ${req.user.email}! This is a protected route.`);
})
module.exports = userProfileRouts