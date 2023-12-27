const { Router } = require("express");
const { login, registerNewAccount, updateProfile, updatePassword, addConcern } = require('../methods/user_profile/profile_curd.js');
const { authenticateTokenHandler } = require("../methods/auth");
const {scoreboard, findSpecificUser} = require("../methods/user_profile/search_useres");

const userProfileRouts = Router();

// User registration
userProfileRouts.post('/register', registerNewAccount);

// User login
userProfileRouts.post('/login', login);

// Update user profile
userProfileRouts.patch('/update', authenticateTokenHandler, updateProfile);

// Update user password
userProfileRouts.patch('/update_password', authenticateTokenHandler, updatePassword);

// Add user concern
userProfileRouts.post('/add_concern/:concern', authenticateTokenHandler, addConcern);

userProfileRouts.get("/scoreboard",authenticateTokenHandler,scoreboard)
userProfileRouts.get("/:email",authenticateTokenHandler,findSpecificUser)
module.exports = userProfileRouts;
