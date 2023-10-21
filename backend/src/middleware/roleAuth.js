const { verifyToken } = require('../helpers/token')
const UserModel = require('../model/User.model')

const roleAuth = (roles) = async (req, res, next) => {

    try {

        //const token = req.headers.authorization.split(' ').pop()
        //const tokenData = await verifyToken(token)
        const userData = await UserModel.findById(req.userId)


        if ([].concat(roles).includes(userData.role)) {

            next()
        } else {
            res.status(409)
            res.send({ error: "No tienes Permisos" })
        }

    } catch (error) {
        res.status(409)
        res.send({ error: "Usuario invalido" })

    }
}

module.exports = roleAuth