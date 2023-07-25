import jwt from 'jsonwebtoken'
import asyncHalndler from 'express-async-handler'
import User from '../models/userModel.js'

export const protect = asyncHalndler(async (req, res, next) => {
    let token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await User.findById(decoded.userId).select('-password') //it fetches the user with reqd userId and it detail without the password
            next();
        }
        catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('Not authorized, token failed')

        }

    }
    else {
        res.status(401);
        throw new Error('No authorized User, no token')
    }

})