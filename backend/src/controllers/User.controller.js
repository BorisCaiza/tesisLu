
const UserCtrl = {};
const userModel = require('../model/User.model')
const JWT = require('jsonwebtoken');
const { tokenSign, tokenRefreshSign } = require('../helpers/token')
const bcrypt = require('bcryptjs');

UserCtrl.login = async (req, res) => {

    const { email, password } = req.body
    const user = await userModel.findOne({ email: email })

    if (!user) {
        res.status(400).send({
            status: false,
            message: 'El usuario no está registrado'
        })
    } else {


        if (user.sesion.Bloqueado === false) {

            const match = await bcrypt.compare(password, user.password)



            if (match) {

                const token = await tokenSign(user)
                // Refresh token
                const refreshToken = await tokenRefreshSign(user)

                user.refreshTokens.push(refreshToken);

                user.sesion.Bloqueado = false
                user.sesion.nIntentos = 0
                await user.save()

                res.status(200).send({
                    status: 'Bienvenido',
                    id: user._id,
                    token,
                    refreshToken,
                    email: user.email,
                    perfil: user.perfil,
                    permisos: user.permisos,
                    name: user.name
                })

            } else {

                if (user.sesion.nIntentos > 1) {
                    var horaActual = Date.now();
                    var horaDesbloqueo = horaActual + 30000;
                    user.sesion.HoraBloqueo = horaActual;
                    user.sesion.HoraDesbloqueo = horaDesbloqueo
                    user.sesion.Bloqueado = true;
                    await user.save();


                    res.status(400).send({
                        status: 'Estas bloqueado por 30 segundos'
                    })

                } else {
                    user.sesion.nIntentos = user.sesion.nIntentos + 1;
                    await user.save();
                    res.status(400).send({
                        status: 'Datos incorrectos',
                    })
                }



            }
        } else {
            try {
                const token = await tokenSign(user)

                // Refresh token
                const refreshToken = await tokenRefreshSign(user)

                // user.arrayRefreshTokens.push(refreshToken)
                user.refreshTokens.push(refreshToken);
                await user.save()
                const hora = Date.now()
                if (hora > user.sesion.HoraDesbloqueo) {
                    user.sesion.Bloqueado = false
                    user.sesion.nIntentos = 0
                    await user.save()

                    const match = await bcrypt.compare(password, user.password)

                    if (match) {
                        res.status(200).send({
                            status: 'Bienvenido',
                            id: user._id,
                            name: user.name,
                            token,
                            refreshToken,
                            permisos: user.permisos,
                            email: user.email,
                            perfil: user.perfil,
                            role: user.role
                        })

                    } else {
                        res.status(400).send({
                            status: 'Datos incorrectos',
                        })

                    }



                } else {
                    res.status(400).send({
                        status: 'estas bloqueado por 30 segundos'
                    })

                }
            } catch (err) {
                console.log(err)
            }
        }
    }
};

UserCtrl.register = async (req, res) => {
    const { name, email, password, perfil } = req.body;

    try {
        // Comprueba si el correo electrónico ya está registrado
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                status: false,
                message: "El correo electrónico ya está registrado",
            });
        }

        // Crea un nuevo usuario con permisos
        const newUser = new userModel({
            name,
            email,
            password,
            perfil
        });

        // Hashea la contraseña antes de guardarla en la base de datos
        newUser.password = await bcrypt.hash(password, 10);

        // Guarda el nuevo usuario en la base de datos
        await newUser.save();

        res.status(200).json({
            status: true,
            message: "Usuario creado con éxito.",
        });
    } catch (error) {
        console.log("Error al crear usuario:", error);
        res.status(500).json({
            status: false,
            message: "Error al crear usuario.",
        });
    }
};


UserCtrl.logOut = async (req, res) => {
    const refreshToken = req.body.token;
    const user = await userModel.findOne({ refreshTokens: refreshToken })
    if (!user) return res.status(401).json("Dont exist user")
    user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken)
    await user.save()
    res.status(200).json("You logged out successfully")
}

UserCtrl.token = async (req, res) => {

    //take refrersh token from the usert
    const refreshToken = req.body.token

    //send error if there is no token or it is invalid

    console.log("entree", refreshToken)

    if (!refreshToken) return res.status(401).json("You are not authenticated!")

    const user = await userModel.findOne({ refreshTokens: refreshToken })
    try {
        if (!user.refreshTokens.includes(refreshToken)) {
            return res.status(403).json("Refresh token is not valid!")

        }
    } catch (error) {
        console.log(error);
    }





    JWT.verify(refreshToken, process.env.JWT_SECRET_REFRESH, async (err, user) => {
        err && console.log(err);
        const user2 = await userModel.findOne({ refreshTokens: refreshToken })
        if (!user2 && !user2.refreshTokens) {
            return res.status(403).json({
                status: "false",
                message: "No se encuentra refreshTokens"
            })
        }
        user2.refreshTokens = user2.refreshTokens.filter((token) => token !== refreshToken)

        await user2.save()

        try {
            const newToken = await tokenSign(user2)
            const newRefresthToken = await tokenRefreshSign(user2)

            user2.refreshTokens.push(newRefresthToken)

            await user2.save()

            res.status(200).json({
                token: newToken,
                refreshToken: newRefresthToken
            })
        } catch (err) {
            res.status(403).json({
                status: "token expirado"
            })
            console.log(err)
        }
    })
    // if everthing is ok, create new acceso token and refresth token, send to user
}
UserCtrl.getUsers = async (req, res) => {
    const users = await userModel.find()
    if (!users) return res.status(401).json("No existen usuarios")
    res.status(200).json({ status: true, users: users })
}

UserCtrl.getUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await userModel.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ status: false, message: "Usuario no encontrado" });
        }

        res.status(200).json({ status: true, user: user });
    } catch (error) {
        console.error("Error al buscar el usuario:", error);
        res.status(500).json({ status: false, message: "Error interno del servidor" });
    }
};
UserCtrl.updateUserPermissions = async (req, res) => {
    try {
        const { userId } = req.params; // Obtener el ID del usuario de los parámetros de la URL
        const { nuevosPermisos } = req.body; // Obtener los nuevos permisos del cuerpo de la solicitud

        // Buscar el usuario por su ID
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ status: false, message: 'Usuario no encontrado' });
        }

        // Actualizar los permisos del usuario con los nuevos permisos
        user.permisos = nuevosPermisos;

        // Guardar los cambios en la base de datos
        await user.save();

        res.status(200).json({ status: true, message: 'Permisos actualizados exitosamente' });
    } catch (error) {
        console.error('Error al actualizar los permisos:', error);
        res.status(500).json({ status: false, message: 'Error al actualizar los permisos' });
    }
};
// Manejar la solicitud POST para crear un nuevo usuario
UserCtrl.createUser = async (req, res) => {
    try {
        const userData = req.body;

        // Hashea la contraseña antes de guardarla en la base de datos
        userData.password = await bcrypt.hash(userData.password, 10);

        const newUser = new userModel(userData);

        await newUser.save();

        res.status(200).json({ message: 'Usuario creado con éxito', user: newUser });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
};

UserCtrl.updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const userData = req.body;

        console.log(id);

        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }

        const updatedUser = await userModel.findByIdAndUpdate(id, userData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario actualizado con éxito', user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
};


UserCtrl.getUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la lista de usuarios' });
    }
};

UserCtrl.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Busca el usuario por su ID
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (user.perfil === 'Administrador') {
            const adminUsersCount = await userModel.countDocuments({ perfil: 'Administrador' });

            if (adminUsersCount <= 1) {
                return res.status(400).json({ error: 'No puedes eliminar el último usuario administrador' });
            }
        }

        const deletedUser = await userModel.findByIdAndRemove(userId);

        res.status(200).json({ message: 'Usuario eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
};




module.exports = UserCtrl;