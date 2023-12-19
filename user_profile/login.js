require('express');
const bcrypt = require('bcrypt')
const con = require('../project_connections/database_connection')

let sql = "";


let response = "";

const RegisterNewAccount = async (req, res) => {
    try {
        if (req.session.Email) {
            res.send(`Hi ${req.session.Fname} ${req.session.Lname}, you're already signed in. Please sign out to register a new account.`);
        } else {
             const {Fname, Lname, Email, Password, Profession} = req.body;
            console.log(req.body)
            // Check if the user already exists
            const existingUserQuery = "SELECT Email FROM Profile WHERE Email = ?";
            con.query(existingUserQuery, [Email], async (err, result) => {
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
                        con.query(insertProfileQuery, [Fname, Lname, Email, Profession, 0], (err) => {
                            if (err) {
                                throw err;
                            } else {
                                console.log("Inserted into UserPass table successfully");
                                // Insert into UserPass table
                                const insertUserPassQuery = "INSERT INTO UserPass (Email, Pass) VALUES (?, ?)";
                                con.query(insertUserPassQuery, [Email, hashPass], (err) => {
                                    if (err) {
                                        throw err;
                                    } else {
                                        console.log("Inserted into Profile table successfully");
                                        req.session.Email = Email;
                                        req.session.Fname = Fname;
                                        req.session.Lname = Lname;
                                        req.session.Profession = Profession;
                                        req.session.Score = 0;
                                        res.status(201).send("Registration successful. You can now proceed.");
                                        con.end()
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};


const Login = async (req, res) => {
    try {
        if (req.session.Email) {
            res.send(`Hi ${req.session.Fname} ${req.session.Lname}, you're already signed in`);
        } else {
             const {Fname, Lname, Password} = req.body;
            console.log(Fname + Lname + Password);
            sql = "SELECT *  FROM Profile WHERE FirstName ='" + Fname + "' and LastName ='" + Lname + "'";
            con.query(sql, (err, result) => {
                if (err) throw err;
                if (!result || result.length === 0) {
                    response = "wrong name or password";
                } else {
                    result.forEach(row => {
                        sql = "SELECT Pass FROM UserPass WHERE Email ='" + row.Email + "'";
                        con.query(sql, async (err, result) => {

                            console.log(result[0].Pass);
                            if (await bcrypt.compare(Password, result[0].Pass)) {

                                response = `Welcome ${row.FirstName}`;
                                req.session.Email = row.Email;
                                req.session.Fname = row.FirstName;
                                req.session.Lname = row.LastName;
                                req.session.Profession = row.Profession;
                                req.session.Score = row.Score;
                                req.session.ID = row.ID;
                            }
                        });
                    });
                    if (!response || !response.length) {
                        response = "wrong name or password";
                    }

                }

            });
            setTimeout(() => {
                res.send(response);
                 console.log('This will be logged after 2000 milliseconds (2 seconds)');
            }, 500);

        }
     } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }

};


const Logout = (req, res) => {
    req.session.destroy(err => {
        if (err)
            throw err;
        else res.send("ss").status(200);
    });
};

module.exports = {RegisterNewAccount, Logout, Login}
