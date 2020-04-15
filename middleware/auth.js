const jwt = require('jsonwebtoken')
const jwtSecret = require('config').get('jwtSecret')

module.exports = async (req, res, next) => {
    // get token from header
    const token = req.header('x-auth-token')

    // check if valid token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied!' })
    }

    // verify token
    try {
        const decoded = await jwt.verify(token, jwtSecret)

        req.user = decoded.user;
        next()
    } catch (error) {
        return res.status(401).json({ msg: 'Token is not valid!' })
    }
}