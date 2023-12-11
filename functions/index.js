import express from 'express'
import bcrypt from 'bcrypt'
const app= express();
const port = 6969

app.get('/test', function(req, res){
    res.send("Hello world!");
});

app.listen(port);