require('express');
const con = require('../../../project_connections/database_connection')

const getAllReports = (req,res)=>{
    const GetRep="select  title, text, author, location, issuedate, concern from Report"
    con.query(GetRep,(err , results)=>{
       if (err)
           throw err;
       res.send(results);
    });
}

const getSpecificReport = (req,res)=>{
    const title = req.params.title
    const GetRep="select  title, text, author, location, issuedate, concern from Report where Report.Title ='"+title+"'"
    con.query(GetRep,(err , results)=>{
        if (err)
            throw err;
        res.send(results);
    });
}
module.exports = {getAllReports,getSpecificReport}