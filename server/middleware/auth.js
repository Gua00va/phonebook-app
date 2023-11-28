const jwt = require('jsonwebtoken');
require('dotenv').config();
const { User } = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET;

const auth = async(req, res, next) => {
    try {
        const token = req.header("Authorization").replace('Bearer ', '');
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findOne({
            _id: decoded._id,
            "tokens.token": token,
        })

        if(!user) {
            throw new Error();
        }

        req.user = user;
        req.token = token;

        // console.log("done");
        next();

        } catch(e) {
            console.log(e);
            res.status(401).send(e);
        }
}

module.exports = auth;