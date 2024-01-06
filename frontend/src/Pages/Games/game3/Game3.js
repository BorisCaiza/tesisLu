import React, { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import './game3.css';
import { getrhymingWords } from '../../../services/datosServices';
import api from "../../../api/api"
import { AuthContext } from '../../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import confetti from "canvas-confetti"
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const rimaCon = new Audio("https://drive.google.com/uc?id=14oQ4MJOZnrN-o7I94QJHesZSokaGILlF");

const Game3 = () => {

    const navigator = useNavigate();

    const { user } = useContext(AuthContext);
    const [targetWord, setTargetWord] = useState({});
    const [option1, setOption1] = useState({});
    const [option2, setOption2] = useState({});
    const [bestTime, setBestTime] = useState(null);
    const [isRunning, setIsRunning] = useState(true);
    const [time, setTime] = useState(0);
    const [mouseOverTime, setMouseOverTime] = useState(0);
    const synth = window.speechSynthesis;

    const [targetWordAudio, setTargetWordAudio] = useState(null);
    const [option1Audio, setOption1Audio] = useState(null);
    const [option2Audio, setOption2Audio] = useState(null);

    const getScore = async () => {
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
        const { palabra, rima, seleccionAleatoria } = getrhymingWords();
        setTargetWord(palabra);
        if (orden === 1) {
            setOption1(rima)
            setOption2(seleccionAleatoria);
        } else {
            setOption1(seleccionAleatoria)
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

    const handleMouseEnter = (word) => {
        const timeoutId = setTimeout(() => {
            getVoice(word);
        }, 500);
        setMouseOverTime(timeoutId);
    };

    const handleMouseLeave = () => {
        clearTimeout(mouseOverTime);
    };

    useEffect(() => {
        if (targetWord !== null) {
            const audio = new Audio(targetWord.audio);
            audio.addEventListener('ended', () => {
                rimaCon.play();
            });
            setTargetWordAudio(audio);
        }
        if (option1 !== null) {
            setOption1Audio(new Audio(option1.audio));
        }
        if (option2 !== null) {
            setOption2Audio(new Audio(option2.audio));
        }
    }, [targetWord, option1, option2 ]);

    const playAudio = async (word) => {
        if (word) {
            word.play()
        }
    };

    const handleOptionSelect = (selectedOption) => {
        let gano = false;
        if (targetWord.rimas === selectedOption.id) {
            gano = true;
            saveScore();
        }
        Swal.fire({
            title: gano ? '¡Ganaste!' : 'Perdiste',
            text: gano ? '¡Bien hecho! La palabra rima correctamente.' : 'La palabra seleccionada no rima correctamente.',
            icon: gano ? 'success' : 'error',
            confirmButtonText: 'Jugar de Nuevo',
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

    const getVoice = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-MX';
        utterance.name = "Microsoft Sabina - Spanish (Mexico)";
        utterance.voiceURI = "Microsoft Sabina - Spanish (Mexico)";
        synth.speak(utterance);
    }

    return (
        <div className="board">
            <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontWeight: "bold" }}>{targetWord && targetWord.word}
                    <VolumeUpIcon
                        onClick={() => playAudio(targetWordAudio)}
                        style={{ cursor: "pointer", color: "yellowgreen", fontSize: "1.5em" }}
                    />
                </h1>
                <img
                    src={targetWord.image}
                    alt="targetWord"
                    style={{ maxHeight: '150px' }}
                />
                <h3>
                    Rima con...{' '}

                </h3>
                <div className="button-container">
                    <button onClick={() => handleOptionSelect(option1)} onMouseEnter={() => playAudio(option1Audio)}>
                        <img src={option1.image} alt="Option Incorrect" />
                    </button>
                    <button onClick={() => handleOptionSelect(option2)} onMouseEnter={() => playAudio(option2Audio)}>
                        <img src={option2.image} alt="Option Correct" />
                    </button>
                </div>
            </div>
            <div className='mt-3'>Cronómetro: {time} segundos</div>
            <div>Mejor tiempo: {bestTime}</div>
        </div>
    );
};

export default Game3;
