import React, { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import './game3.css';
import { getrhymingWords } from '../../../services/datosServices';
import api from "../../../api/api"
import { AuthContext } from '../../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Game3 = () => {

    const navigator = useNavigate();

    const { user } = useContext(AuthContext);
    const [targetWord, setTargetWord] = useState({});
    const [optionCorrectSelect, setOptionCorrectSelect] = useState({});
    const [optionIncorrectSelect, setOptionIncorrectSelect] = useState({});
    const [gameResult, setGameResult] = useState(null);
    const [bestTime, setBestTime] = useState(null);
    const [isRunning, setIsRunning] = useState(true);
    const [time, setTime] = useState(0);
    const orden = Math.random() < 0.5 ? 1 : 2;

    const getScore = async () => {

        const score = {

            token: user.token,
            game: "game3"

        }

        try {

            const response = await api.post('/getScore', score)

            if (response.status === 200) {

                console.log("mejor tiempo", response.data.game.bestTime)

                setBestTime(response.data.game.bestTime)
            }
        } catch (error) {

        }

    }

    const saveScore = async () => {




        const score = {
            bestTime: time,
            game: "game3",
            token: user.token
        }

        try {

            const response = await api.post('/score', score)

        } catch (error) {

        }
    }





    const getDatos = () => {
        const { palabra, rima, seleccionAleatoria } = getrhymingWords();
        console.log(`Palabra Aleatoria: ${palabra}`);
        setTargetWord(palabra);
        setOptionCorrectSelect(rima);
        setOptionIncorrectSelect(seleccionAleatoria);
    };

    useEffect(() => {
        getDatos();
        getScore();
    }, []);

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => {
            clearInterval(interval);
        };
    }, [isRunning]);



    const handleOptionSelect = (selectedOption) => {
        if (selectedOption.name === optionCorrectSelect.name) {

            saveScore();
            getScore();
            Swal.fire({
                title: '¡Ganaste!',
                text: '¡Bien hecho! La palabra rima correctamente.',
                icon: 'success',
                showCancelButton: true,
                cancelButtonText: 'Volver a jugar',
                cancelButtonText: 'Salir',
            }).then((result) => {

                if (result.isConfirmed) {
                    getDatos();
                    getScore();
                    setTime(0);
                } else {
                    navigator("/")
                }
            });
        } else {
            Swal.fire({
                title: 'Perdiste',
                text: 'La palabra seleccionada no rima correctamente.',
                icon: 'error',
                showCancelButton: true,
                cancelButtonText: 'Volver a jugar',
            }).then((result) => {
                if (result.isConfirmed) {
                    getDatos();
                    getScore();
                    setIsRunning(true);
                    setTime(0);
                } else {
                    navigator("/")
                }
            });
        }
    };

    return (
        <div className="board">
            <div>
                <img src={targetWord.image} alt="Option" style={{ height: 75 }} />
                <h1>{targetWord && targetWord.name}</h1>
                <h3>Rima con...</h3>
                <div className="button-container">
                    {orden === 1 ? (
                        <>
                            <button onClick={() => handleOptionSelect(optionIncorrectSelect)}>
                                <img src={optionIncorrectSelect.image} alt="Option Incorrect" />
                            </button>
                            <button onClick={() => handleOptionSelect(optionCorrectSelect)}>
                                <img src={optionCorrectSelect.image} alt="Option Correct" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => handleOptionSelect(optionCorrectSelect)}>
                                <img src={optionCorrectSelect.image} alt="Option Correct" />
                            </button>
                            <button onClick={() => handleOptionSelect(optionIncorrectSelect)}>
                                <img src={optionIncorrectSelect.image} alt="Option Incorrect" />
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div className='mt-3'>Cronómetro: {time} segundos</div>
            <div>Mejor tiempo: {bestTime}</div>
        </div>
    );
};

export default Game3;
