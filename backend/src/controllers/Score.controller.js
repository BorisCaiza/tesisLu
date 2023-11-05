
const ScoreCtrl = {};
const ScoreModel = require('../model/Score.model');
const scoreModel = require('../model/Score.model')
const userModel = require('../model/User.model')


ScoreCtrl.create = async (req, res) => {

    console.log("entree")


    const { bestTime, game, token } = req.body;

    if (!bestTime || !game || !token) {
        return res.status(400).json({
            status: false,
            message: 'Faltan datos obligatorios (bestTime, game, token)'
        });
    }

    try {
        const user = await userModel.findOne({ tokens: token });



        if (!user) {
            return res.status(400).json({
                status: false,
                message: 'No se encontró al usuario'
            });
        }

        let gameFinded = await ScoreModel.findOne({ user: user._id, game: game });

        if (gameFinded) {


            if (bestTime < gameFinded.bestTime || gameFinded.bestTime === null) {

                console.log("mejor tiempo", bestTime)

                gameFinded.bestTime = bestTime
                await gameFinded.save()
            }

            res.status(200).json({
                status: true,
                message: 'Se ha creado el score'
            });

        } else {

            res.status(400).json({
                status: true,
                message: 'No se encontro el registro'
            });



        }





    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            status: false,
            message: 'Error al guardar score'
        });
    }
};


ScoreCtrl.getScore = async (req, res) => {


    const { game, token } = req.body


    if (!game || !token) {
        res.status(400).send({
            status: false,
            message: 'El usuario no está registrado'
        })


    } else {

        const user = await userModel.findOne({ tokens: token })

        if (!user) {
            return res.status(400).send({
                status: false,
                meessage: "El usuario no esta autenticado"
            })
        }

        try {

            const gameFinded = await scoreModel.findOne({ user: user._id, game: game })

            if (gameFinded) {

                if (gameFinded) {

                    res.status(200).send({
                        status: true,
                        game: gameFinded
                    })
                }


            } else {

                console.log("entree")

                const newScore = scoreModel({
                    user: user._id,
                    game: game,
                    bestTime: null
                })

                await newScore.save()

                return res.status(200).send({
                    status: true,
                    game: newScore

                })
            }
        } catch (error) {


            res.status(400).send({
                status: false,
                message: "Error al encontrar información"
            })



        }

    }
}


module.exports = ScoreCtrl;