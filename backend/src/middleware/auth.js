const { verifyToken } = require('../helpers/token')
const jwt = require('jsonwebtoken')


const checkAuth = async (req, res, next) => {


    try {
        console.log(req.headers.authorization)
        console.log("!!!!!!!!!!")
        const token = req.headers.authorization.split(' ').pop()
        console.group("token", token)
        const tokenData = await jwt.verify(token, process.env.JWT_SECRET)
        console.log("!!!!!!!!!")
        console.log("token data", tokenData)


        if (tokenData._id) {
            req.userId = tokenData._id
            next()
        } else {
            res.status(401) // Cambiar el código de estado a 401
            res.send({ error: "Usuario inválido" })
        }
    } catch (error) {
        console.log("error", error)
        res.status(401) // Cambiar el código de estado a 401
        res.send({ error: "Error en la autenticación" })
    }
}

module.exports = checkAuth
