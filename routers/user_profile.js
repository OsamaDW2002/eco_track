const { Router } = require("express");
const { login, registerNewAccount, updateProfile, updatePassword, addConcern } = require('../methods/user_profile/user_profile_methods.js');
const { authenticateTokenHandler } = require("../methods/auth");
const {scoreboard, findSpecificUser} = require("../methods/user_profile/other_users");

const userProfileRouts = Router();

// User registration
userProfileRouts.post('/register', registerNewAccount);

// User login
userProfileRouts.post('/login', login);

// Update user profile
userProfileRouts.patch('/updateProfile', authenticateTokenHandler, updateProfile);

// Update user password
userProfileRouts.patch('/updatePassword', authenticateTokenHandler, updatePassword);

// Add user concern
userProfileRouts.patch('/addConcern/:newConcern', authenticateTokenHandler, addConcern);

userProfileRouts.get("/scoreboard",authenticateTokenHandler,scoreboard)
userProfileRouts.get("/:email",authenticateTokenHandler,findSpecificUser)
module.exports = userProfileRouts;
