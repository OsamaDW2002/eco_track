require('express');
const bcrypt = require('bcrypt')
const con = require('../../project_connections/database_connection')
const {generateToken} = require("./auth");

let sql = "";



const registerNewAccount = async (req, res) => {
    const {Fname, Lname, Email, Password, Profession} = req.body;
    console.log(req.body)
    // Check if the user already exists
    console.log(Email.toLowerCase())
    const existingUserQuery = "SELECT Email FROM Profile WHERE Email = ?";
    con.query(existingUserQuery, [Email.toLowerCase()], async (err, result) => {
        if (err) {
            throw err;
        } else {
            console.log("Search for email passed successfully");
            if (result.length) {
                res.status(400).send("Email already exists");
            } else {
                // Hash the password
                const hashPass = await bcrypt.hash(Password, 10);

                // Insert into Profile table
                const insertProfileQuery = "INSERT INTO Profile (FirstName, LastName, Email, Profession, Score) VALUES (?, ?, ?, ?, ?)";
                con.query(insertProfileQuery, [Fname, Lname, Email.toLowerCase(), Profession, 0], (err) => {
                    if (err) {
                        throw err;
                    } else {
                        console.log("Inserted into UserPass table successfully");
                        // Insert into UserPass table
                        const insertUserPassQuery = "INSERT INTO UserPass (Email, Pass) VALUES (?, ?)";
                        con.query(insertUserPassQuery, [Email.toLowerCase(), hashPass], (err) => {
                            if (err) {
                                throw err;
                            } else {
                                res.status(201).send("Registration successful. You can now proceed.");
                            }
                        });
                    }
                });
            }
        }
    });

};


const login = async (req, res) => {
    const {email, password} = req.body;
    sql = "SELECT PASS FROM UserPass WHERE Email= '" + email.toLowerCase() + "'"
    await con.query(sql, async (err, result) => {
        if (err) {
            throw err
        } else {
            if (result.length === 0 || !result) {
                res.send("User doesn't exist")
            } else {
                console.log(result[0])
                if (await bcrypt.compare(password, result[0].PASS)) {
                    sql = "SELECT *  FROM Profile WHERE Email = '" + email.toLowerCase() + "'";
                    await con.query(sql, async (err, result) => {
                        console.log(result[0])
                        const token = generateToken({
                            email: result[0].Email,
                            first_name: result[0].FirstName,
                            last_name: result[0].LastName,
                            profession: result[0].Profession
                        })
                        res.send(token);
                    })

                }
            }
        }
    })
};


module.exports = {registerNewAccount,login}