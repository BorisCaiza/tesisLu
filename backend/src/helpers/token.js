const jwt = require('jsonwebtoken')

const tokenSign = async (user) => {

    return jwt.sign(
        {
            _id: user._id,

        },
        process.env.JWT_SECRET,
        {
            expiresIn: "365d"
        }
    )
}

const tokenRefreshSign = async (user) => {

    return jwt.sign(
        {
            _id: user._id,

        },
        process.env.JWT_SECRET_REFRESH,
        {
            expiresIn: "48h"
        }
    )


}

const verifyToken = async (token) => {

    try {
        return jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        return null
    }
}

const decodeSign = (token) => {

    return jwt.decode(token);


}

module.exports = { tokenSign, tokenRefreshSign, verifyToken, decodeSign }