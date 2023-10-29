const express = require('express');
const router = express.Router();
const scoreCtrl = require('../controllers/Score.controller');



//crear
router.post('/score', scoreCtrl.create);
//Obtener todos

router.post('/getScore', scoreCtrl.getScore);




module.exports = router;