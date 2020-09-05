const jwt = require('jsonwebtoken')
const config = require('config')
module.exports = function (req, res, next) {
    //get token from header
    const token = req.header('e')
    //check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorized denied' })
    }
    //varify token 
    try {
        const decoded = jwt.verify(token, config.get('JwtSecret'))
        req.user = decoded.user;
        next()
    } catch (error) {
        return res.status(401).json({ msg: 'Token is not valid' })
    }


}