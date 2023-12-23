require('express');
const con = require('../../project_connections/database_connection');
const moment = require('moment');
function EditScore(email , Score){
const updateScore="UPDATE Profile SET Score ="+Score+ " WHERE Email = ?";
con.query(updateScore,[email],(err) => {
    if(err){
        throw err;
    }
});
}
function  AddNewTime(email , currentTime){
    const updateScore="UPDATE Profile SET LogTime = ? WHERE Email = ?";
    con.query(updateScore,[currentTime , email],(err) => {
        if(err){
            throw err;
        }
    });
}
function loggingPoint(email){
    // check if there's a time before or not
    const checkTime = "SELECT Score,LogTime FROM Profile WHERE Email = ?";

    con.query(checkTime,[email.toLowerCase()],async(err,results)=>{
      try {
              console.log(results[0].LogTime)
              const lastTime = moment(results[0].LogTime, 'YYYY-MM-DDTHH:mm:ss');
              console.log(lastTime)
              if (lastTime.isValid()) {
                  const currentTime = moment();
                  const diffInMilliseconds = Math.abs(currentTime.diff(lastTime));

                  // Convert milliseconds to hours
                  const diffInHours = moment.duration(diffInMilliseconds).asHours();

                  console.log(diffInHours); // Output the difference in hours

              if (!results[1] && diffInHours > 24) {
                  let Score = parseInt(results[0].Score);
                  Score++;

                  EditScore(email, Score);
                  AddNewTime(email, currentTime.format('YYYY-MM-DDTHH:mm:ss').toString());
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

function addPoints(email , pointNum){
    // check if there's a time before or not
    const userScore = "SELECT Score FROM Profile WHERE Email = ?";

    con.query(userScore,[email.toLowerCase()],async(err,results)=>{
        console.log(results[0].Score);
        if(results[0]){
            let Score =parseInt(results[0].Score);
            Score+=pointNum;
            console.log(email + " s   s" + Score);
            EditScore(email,Score);
            console.log("add point successfully");
        }
        else {
            console.log("add point failure");
        }
    });
}
module.exports = {addPoints,loggingPoint};