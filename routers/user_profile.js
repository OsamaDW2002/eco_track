const {Login, RegisterNewAccount} = require('../methods/user_profile/user_profile_methods.js');
const {Router} = require("express");
const {authenticateTokenHandler} = require("../methods/user_profile/auth");
const router = Router();


router.post('/register',RegisterNewAccount);
router.post('/login', Login);
router.get('/signed_test',authenticateTokenHandler,(req, res) => {
    res.send(`Hello, ${req.user.email}! This is a protected route.`);
})
module.exports = router