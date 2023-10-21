const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/User.controller');



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

module.exports = router;