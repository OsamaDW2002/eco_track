const {Router} = require("express");
const {
    login,
    registerNewAccount,
    updateProfile,
    updatePassword,
    addConcern
} = require('../methods/user_profile/profile_curd.js');
const {authenticateTokenHandler} = require("../methods/auth");
const {scoreboard, findSpecificUser, findUsersByConcern} = require("../methods/user_profile/search_useres");

const userProfileRouts = Router();

userProfileRouts.post('/register', registerNewAccount);

userProfileRouts.post('/login', login);

userProfileRouts.patch('/update', authenticateTokenHandler, updateProfile);

userProfileRouts.patch('/update_password', authenticateTokenHandler, updatePassword);

userProfileRouts.post('/add_concern/:concern', authenticateTokenHandler, addConcern);

userProfileRouts.get("/scoreboard", authenticateTokenHandler, scoreboard)
userProfileRouts.get("/:email", authenticateTokenHandler, findSpecificUser)
userProfileRouts.get("/concern/:concern", authenticateTokenHandler, findUsersByConcern)


module.exports = userProfileRouts;
