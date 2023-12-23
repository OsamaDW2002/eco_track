require('express');
const con = require('../../project_connections/database_connection');
const moment = require('moment');
function EditScore(Email , Score){
const updateScore="UPDATE Profile SET Score ="+Score+ " WHERE Email = ?";
con.query(updateScore,[Email],(err) => {
    if(err){
        throw err;
    }
});
}
function  AddNewTime(Email , currentTime){
    const updateScore="UPDATE Profile SET LogTime = ? WHERE Email = ?";
    con.query(updateScore,[currentTime , Email],(err) => {
        if(err){
            throw err;
        }
    });
}
function logging_point(Email){
    // check if there's a time before or not
    const checkTime = "SELECT Score,LogTime FROM Profile WHERE Email = ?";

    con.query(checkTime,[Email.toLowerCase()],async(err,results)=>{
      try {
              console.log(results[0].LogTime)
              const lasttime = moment(results[0].LogTime, 'YYYY-MM-DDTHH:mm:ss');
              console.log(lasttime)
              if (lasttime.isValid()) {
                  const currentTime = moment();
                  const diffInMilliseconds = Math.abs(currentTime.diff(lasttime));

                  // Convert milliseconds to hours
                  const diffInHours = moment.duration(diffInMilliseconds).asHours();

                  console.log(diffInHours); // Output the difference in hours

              if (!results[1] && diffInHours > 24) {
                  let Score = parseInt(results[0].Score);
                  Score++;

                  EditScore(Email, Score);
                  AddNewTime(Email, currentTime.format('YYYY-MM-DDTHH:mm:ss').toString());
              } else {
                  console.log("Less than 24 hours have passed to obtain the point");
              }
          }
      }
      catch (ex){
          throw ex;
      }
    });
}

function add_points(Email , pointnum){
    // check if there's a time before or not
    const userScore = "SELECT Score FROM Profile WHERE Email = ?";

    con.query(userScore,[Email.toLowerCase()],async(err,results)=>{
        console.log(results[0].Score);
        if(results[0]){
            let Score =parseInt(results[0].Score);
            Score+=pointnum;
            console.log(Email + " s   s" + Score);
            EditScore(Email,Score);
            console.log("add point successfuly");
        }
        else {
            console.log("add point failure");
        }
    });
}
module.exports = {add_points,logging_point};