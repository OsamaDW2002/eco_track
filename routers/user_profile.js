const {Login, RegisterNewAccount} = require('../methods/user_profile/user_profile_methods.js');
const {Router} = require("express");
const {authenticateTokenHandler} = require("../methods/user_profile/auth");
const userProfileRouts = Router();


userProfileRouts.post('/register',RegisterNewAccount);
userProfileRouts.post('/login', Login);
userProfileRouts.get('/signed_test',authenticateTokenHandler,(req, res) => {
    res.send(`Hello, ${req.user.email}! This is a protected route.`);
})
module.exports = userProfileRouts