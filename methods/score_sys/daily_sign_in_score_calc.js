require('express');
const con = require('../../project_connections/database_connection');
const moment = require('moment');

function EditScore(Email , Score){
const updateScore="UPDATE Profile SET Score = Score + ?  WHERE Email = ?";
con.query(updateScore,[Score , Email],(err) => {
    if(err){
        throw err;
    }
});
}
function  AddNewTime(Email , currentTime){
    const updateScore="UPDATE Profile SET Time = ? WHERE Email = ?";
    con.query(updateScore,[currentTime , Email],(err) => {
        if(err){
            throw err;
        }
    });
}
function logging_point(Email){
    // check if there's a time before or not
    const checkTime = "SELECT Score,logTime FROM Profile WHERE Email = ?";
    const currentTime=moment();

    con.query(checkTime,[Email.toLowerCase()],async(err,results)=>{
        const differenceMs = Math.abs(currentTime - results[1]);
        const differenceHours = differenceMs / (1000 * 60 * 60);
        if(!results[1] || differenceHours > 24){
            let Score =parseInt(results[0]);
            Score++;
            EditScore(Email,Score);
            AddNewTime(Email , currentTime);
        }
        else {
            console.log("Less than 24 hours have passed to obtain the point");
        }
    });
}

function add_points(Email , pointnum){
    // check if there's a time before or not
    const checkTime = "SELECT Score FROM Profile WHERE Email = ?";
    con.query(checkTime,[Email.toLowerCase()],async(err,results)=>{
        if(!results[0]){
            let Score =parseInt(results[0]);
            Score+=pointnum;
            EditScore(Email,Score);
        }
        else {
            console.log("Less than 24 hours have passed to obtain the point");
        }
    });
}
module.exports = {add_points,logging_point};