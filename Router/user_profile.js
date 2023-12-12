import {RegisterNewAccount} from '../user_profile/login.js';
import {app} from '../project_connections/express_connection.js';
import {Login} from '../user_profile/login.js';
import {Logout} from '../user_profile/login.js';


app.post('/register',RegisterNewAccount);
app.post('/login',Login);
app.get('/logout',Logout);