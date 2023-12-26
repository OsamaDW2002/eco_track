require('express');
const con = require('../../../project_connections/database_connection')

const getAllResources = (req,res)=>{
    const GetRes="select name, url, source, concern from Resources"
    con.query(GetRep,(err , results)=>{
        if (err)
            throw err;
        res.send(results);
    });
}

const getSpecificResource = (req,res)=>{
    const name = req.params.name
    const GetRes="select name, url, source, concern from Resources where Resources.Name ='"+name+"'"
    con.query(GetRep,(err , results)=>{
        if (err)
            throw err;
        res.send(results);
    });
}
module.exports = {getAllResources,getSpecificResource}