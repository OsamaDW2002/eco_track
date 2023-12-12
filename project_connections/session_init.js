import session from "express-session";
import {app} from "./express_connection.js";

export const session_init =app.use(session({
    secret: 'secret-key',
    saveUninitialized:false,
    resave: false,
    cookie: { maxAge: 60 * 1000 }
}));