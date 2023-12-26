require('express');
const con = require('../../../project_connections/database_connection')

function merge (results1 , results2 , key) {

    const mergedArray = results1.map(obj => {
        const matchingObjs = results2.filter(item => item.Concern === obj.Concern);
        if (matchingObjs.length ) {
            const mergedObj = { ...obj };
            const names = matchingObjs.map(matchingObj => matchingObj[key]);
            if (names.length ) {
                mergedObj[key] = names;
            }
            return mergedObj;
        }
        return obj;
    });

    return mergedArray;
}

const top5Concerns= (req,res)=>{
    const Top5Concern = "select count(User) , Concerns.Concern  from UserConcern , Concerns where UserConcern.Concern = Concerns.Concern group by UserConcern.Concern order by count(User) desc limit 5";
    console.log("acbjhjsba")
    const ReportMatchConcern = "select Concerns.Concern , Report.title from Report , Concerns where Concerns.Concern = Report.Concern"
    const ResourceMatchConcern = "select name from Resources , Concerns where Concerns.Concern = Resources.Concern"
    con.query(Top5Concern , (err,results1)=>{
        con.query(ReportMatchConcern , (err,results2)=>{
            con.query(ResourceMatchConcern , (err,results3)=> {
                if (err) {
                    throw err
                }

                const mergeRepCon = merge(results1,results2,"title");
                res.send(merge( mergeRepCon, results3  ,  "name") );
            });
        });
    });
}
module.exports= {top5Concerns};