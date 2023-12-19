const {Login, Logout, RegisterNewAccount} = require('../user_profile/login.js');
const {Router} = require("express");
const router = Router();


router.post('/register', RegisterNewAccount);
router.post('/login', Login);
router.get('/logout', Logout);

module.exports = router