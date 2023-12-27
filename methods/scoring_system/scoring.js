require('express');
const con = require('../../project_connections/database_connection');
const moment = require('moment');
function EditScore(email , Score){
const updateScore="UPDATE Profile SET Score ="+Score+" WHERE Email = ?";
con.query(updateScore,[email],(err) => {
    if(err){
        throw err;
    }
});
}
function  addNewTime(email , currentTime){
    const updateScore="UPDATE Profile SET LogTime = ? WHERE Email = ?";
    con.query(updateScore,[currentTime , email],(err) => {
        if(err){
            throw err;
        }
    });
}
function addDailyPoint(email){
     const checkTime = "SELECT Score,LogTime FROM Profile WHERE Email = ?";

    con.query(checkTime,[email.toLowerCase()],async(err,results)=>{
      try {
          console.log(results[0].LogTime)
          if (!results[0].LogTime) {
              addNewTime(email, currentTime.format('YYYY-MM-DDTHH:mm:ss').toString());
          } else {
              const lastTime = moment(results[0].LogTime, 'YYYY-MM-DDTHH:mm:ss');
              console.log(lastTime)

              if (lastTime.isValid()) {
                  const currentTime = moment();
                  const diffInMilliseconds = Math.abs(currentTime.diff(lastTime));

                  const diffInHours = moment.duration(diffInMilliseconds).asHours();

                  console.log(diffInHours); // Output the difference in hours

                  if (!results[1] && diffInHours > 24) {
                      let Score = parseInt(results[0].Score);
                      Score++;

                      EditScore(email, Score);
                      addNewTime(email, currentTime.format('YYYY-MM-DDTHH:mm:ss').toString());
                  } else {
                      console.log("Less than 24 hours have passed to obtain the point");
                  }
              }
          }
      }
      catch (ex){
          throw ex;
      }
    });
}

function addPoints(email , pointNum){

    const userScore = "SELECT Score FROM Profile WHERE Email = ?";

    con.query(userScore,[email.toLowerCase()],async(err,results)=>{
        console.log(results[0].Score);
        if(results[0]){
            let Score =parseInt(results[0].Score);
            Score+=pointNum;
             EditScore(email,Score);
            console.log("add point successfully");
        }
        else {
            console.log("add point failure");
        }
    });
}
module.exports = {addPoints, addDailyPoint};