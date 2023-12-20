const {Login, RegisterNewAccount} = require('../user_profile/user_profile_operations.js');
const {Router} = require("express");
const {authenticateTokenHandler} = require("../user_profile/auth");
const router = Router();


router.post('/register',RegisterNewAccount);
router.post('/login', Login);
router.get('/signed_test',authenticateTokenHandler,(req, res) => {
    res.send(`Hello, ${req.user.email}! This is a protected route.`);
})
module.exports = router