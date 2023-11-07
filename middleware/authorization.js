const jwt = require('jsonwebtoken')

const verifyToken = async (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization
        if (bearerToken) {
            const token = bearerToken.split(' ')[1]
            let decoded = await jwt.verify(token, process.env.SUPER_SECERT_KEY)
            // console.log(decoded)
            if (decoded) {
                req.decoded = decoded
                //if always re-sending token to the frontend
                req.token = token
            }
            next()
        } else {
            throw {
                status: 401,
                message: "Missing Token!!!"
            }
        }
    } catch (error) {
        if (error.message === 'jwt expired') {
            res.status(401).json('Authentication Expired')
        }
        res.status(error.status || 401).json(error.message)
    }
}

module.exports = { verifyToken }