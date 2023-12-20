const jwt = require('jsonwebtoken');
require('dotenv').config()

const authenticateTokenHandler = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        jwt.verify(authHeader, process.env.SECRET_KEY, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
             next();
        });
    } else {
        res.sendStatus(401);
    }
}
const generateToken = (user) => {
    return jwt.sign(user, process.env.SECRET_KEY, { expiresIn: '1h' });
};
module.exports={
    generateToken,
    authenticateTokenHandler
}