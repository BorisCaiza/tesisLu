const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/User.controller');




router.post('/user/forgotPassword', userCtrl.forgotPassword)

//cambiar contraseña

router.put("/user/newPassword", userCtrl.newPassword)

//chequearToken 

router.get("/user/checkToken", userCtrl.checkToken)




//crear
router.post('/user', userCtrl.register);
//Obtener todos
router.post('/user/login', userCtrl.login);

router.post('/user/logout', userCtrl.logOut);

router.post('/user/token', userCtrl.token)

router.post('/user/create', userCtrl.createUser)

router.get('/users', userCtrl.getUsers)

router.put('/user/:id/', userCtrl.updateUser)

router.delete('/user/:id/', userCtrl.deleteUser)


router.post('/user/register', userCtrl.register)





module.exports = router;