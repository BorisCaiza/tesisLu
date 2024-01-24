import React, { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import './game3.css';
import { getrhymingWords, playAudio, playAudioRimaCon } from '../../../services/datosServices';
import api from "../../../api/api"
import { AuthContext } from '../../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import confetti from "canvas-confetti"
import soundWin from '../../../assets/sounds/win.wav';
import soundNoMatch from '../../../assets/sounds/no-match.mp3';


const Game3 = () => {

    const navigator = useNavigate();

    const { user } = useContext(AuthContext);
    const [targetWord, setTargetWord] = useState({});
    const [option1, setOption1] = useState({});
    const [option2, setOption2] = useState({});
    const [bestTime, setBestTime] = useState(null);
    const [isRunning, setIsRunning] = useState(true);
    const [time, setTime] = useState(0);
    const [indexWord, setIndexWord] = useState('');

    const audioLose = new Audio(soundNoMatch);
    const audioWin = new Audio(soundWin);

    const getScore = async () => {
        const storedIndexWord = localStorage.getItem('indexWordRhyming');
        setIndexWord(storedIndexWord);
        const score = {
            token: user.token,
            game: "game3"
        }
        try {
            const response = await api.post('/getScore', score)
            if (response.status === 200) {
                setBestTime(response.data.game.bestTime)
            }
        } catch (error) {
            console.error(error);
        }
    }

    const saveScore = async () => {
        const score = {
            bestTime: time,
            game: "game3",
            token: user.token
        }
        try {
            await api.post('/score', score)
        } catch (error) {
            console.error(error);
        }
    }

    const getDatos = () => {
        const orden = Math.random() < 0.5 ? 1 : 2;

        const initialValue = parseInt(localStorage.getItem("indexWordRhyming")) ? parseInt(localStorage.getItem("indexWordRhyming")) : 1;
        const { palabra, rima, palabraAleatoria } = getrhymingWords(initialValue);
        setTargetWord(palabra);
        if (orden === 1) {
            setOption1(rima)
            setOption2(palabraAleatoria);
        } else {
            setOption1(palabraAleatoria)
            setOption2(rima);
        }


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
        let gano = false;
        if (targetWord.rimas === selectedOption.id) {
            gano = true;
            saveScore();
        }
        if (gano) {
            localStorage.setItem("indexWordRhyming", localStorage.getItem("indexWordRhyming") ? parseInt(localStorage.getItem("indexWordRhyming")) + 1 : 0)
            audioWin.play();
        } else {
            audioLose.play();
        }

        const html = `<div>
        <p style="font-size: 40px">⭐⭐⭐</p>
        <p style="font-weight: bold; font-size: 20px">¡Felicidades!</p>
        </div>`
        Swal.fire({
            title: gano ? '¡Ganaste!' : 'Perdiste',
            text: gano ? '¡Bien hecho! La palabra rima correctamente.' : 'La palabra seleccionada no rima correctamente.',
            icon: gano ? 'success' : 'error',
            html: gano && html,
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Salir',
            showCancelButton: true,
            didOpen: () => {
                gano && confetti({
                    particleCount: 100,
                    startVelocity: 30,
                    spread: 360,
                    origin: {
                        x: 0.5,
                        y: 0.5,
                    },
                    zIndex: 10000,
                });
            },
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
    };

    return (
        <div className="board">
            <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontWeight: "bold" }}>{targetWord && targetWord.word}
                </h1>
                <img
                    src={targetWord.image}
                    alt="targetWord"
                    style={{ maxHeight: '150px', cursor: "pointer" }}
                    onMouseEnter={() => playAudioRimaCon(targetWord.audio)}

                />
                <h3>
                    Rima con...{' '}

                </h3>
                <div className="button-container m-5">
                    <button onClick={() => handleOptionSelect(option1)}
                        onMouseEnter={() => playAudio(option1.audio)}
                    >
                        <img src={option1.image} alt="Option Incorrect" />
                    </button>

                    <div className='letter'>
                        o
                    </div>
                    <button onClick={() => handleOptionSelect(option2)}
                        onMouseEnter={() => playAudio(option2.audio)}
                    >
                        <img src={option2.image} alt="Option Correct" />
                    </button>
                </div>
            </div>
            <div style={{ fontWeight: "bold" }}>Cronómetro: {time} segundos</div>
            <div style={{ fontWeight: "bold" }}>Mejor tiempo: {bestTime}</div>
            <div style={{ fontWeight: "bold" }}>Aciertos: {indexWord}/25</div>
        </div>
    );
};

export default Game3;
