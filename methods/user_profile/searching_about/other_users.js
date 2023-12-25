require('express');
const con = require('../../../project_connections/database_connection')
function merge(results){
    const consolidatedData = results.reduce((acc, obj) => {
        const key = `${obj.FirstName}_${obj.LastName}`;
        if (!acc[key]) {
            acc[key] = { ...obj, Concerns: [obj.Concern] };
        } else {
            acc[key].Concerns.push(obj.Concern);
        }
        delete acc[key].Concern;
        return acc;
    }, {});
    return consolidatedData
}

const scoreboard= (req,res)=>{
    const FindUser = "select  FirstName, LastName, Email, Profession,Concern ,Score from UserConcern , Profile where UserConcern.User = Profile.Email order by Profile.Score desc LIMIT 5";
    con.query(FindUser , (err,results)=>{

        res.send(Object.values(merge(results)));
    });
}

const findSpecificUser = async (req,res)=>{
    let email = req.params.email;
    console.log(email);
    const FindUser = "select  FirstName, LastName, Email, Profession,Concern ,Score from UserConcern , Profile where (UserConcern.User = Profile.Email and Profile.Email = ?)";
    await con.query(FindUser ,[email], (err,results)=>{
        res.send(Object.values(merge(results)));
    });
}

module.exports = {scoreboard,findSpecificUser};