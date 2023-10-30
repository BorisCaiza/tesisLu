
const ScoreCtrl = {};
const ScoreModel = require('../model/Score.model');
const scoreModel = require('../model/Score.model')
const userModel = require('../model/User.model')


ScoreCtrl.create = async (req, res) => {

    const { bestTime, game, token } = req.body




    if (!bestTime || !game || !token) {
        res.status(400).send({
            status: false,
            message: 'El usuario no está registrado'
        })
    } else {

        const user = await userModel.findOne({ tokens: token })

        try {

            const game = await scoreModel.findOne({ user: user._id, game: game })



            if (game) {

                if (bestTime >= game.bestTime) {
                    game.bestTime = bestTime

                    await game.save()
                }


            } else {

                if (user) {

                    const score = new ScoreModel({

                        user: user._id,
                        game: game,
                        bestTime: bestTime

                    })


                    await score.save()

                    res.status(200).send({
                        status: false,
                        message: "Se ha creado el score"
                    })


                } else {

                    res.status(400).send({
                        status: false,
                        message: "No se encontro al usuario"
                    })
                }

            }

        } catch (error) {

            console.log("error", error)

            res.status(400).send({
                status: false,
                message: "Error al guardar score"
            })

        }





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

        try {

            const gameFinded = await scoreModel.findOne({ user: user._id, game: game })

            if (gameFinded) {

                if (gameFinded.score > 0) {

                    res.status(200).send({
                        status: true,
                        game: gameFinded
                    })
                } else {

                    gameFinded.score = 0

                    res.status(200).send({
                        status: true,
                        game: gameFinded
                    })
                }


            } else {

                res.status(400).send({
                    status: false,
                    message: "No se encontro información"
                })

            }


        } catch (error) {

            console.log("error", error)



            res.status(400).send({
                status: false,
                message: "Error al encontrar información"
            })



        }

    }
}


module.exports = ScoreCtrl;