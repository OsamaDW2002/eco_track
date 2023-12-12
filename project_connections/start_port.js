import {app} from '../project_connections/express_connection.js';
const port = 6269;
export const startport = app.listen(port,()=>{
    console.log("Start at port 6969");
});