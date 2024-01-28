import React, { useState, useEffect, useCallback, useContext } from 'react';
import Swal from 'sweetalert2';
import confetti from "canvas-confetti"
import "./Game1.css"
import { generateRandomOptions, playAudio } from '../../../services/datosServices';
import soundNoMatch from '../../../assets/sounds/no-match.mp3';
import soundWin from '../../../assets/sounds/win.wav';
import soundClick from "../../../assets/sounds/click.wav"
import { useNavigate } from 'react-router-dom';
import api from "../../../api/api"
import { AuthContext } from '../../../Context/AuthContext';

function Game1() {
    const navigator = useNavigate();
    const { user } = useContext(AuthContext);
    const [targetLetter, setTargetLetter] = useState('');
    const [options, setOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [scrollPosition, setScrollPosition] = useState(0);
    const visibleOptions = 4;
    const [isRunning, setIsRunning] = useState(false);
    const [aciertos, setAciertos] = useState(parseInt(localStorage.getItem("aciertosGame1")) || 0);

    const [bestTime, setBestTime] = useState(null);
    const [time, setTime] = useState(0);

    const audioLose = new Audio(soundNoMatch);
    const audioWin = new Audio(soundWin);
    const audioClick = new Audio(soundClick);

    useEffect(() => {
        console.log('isRunning:', isRunning);
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




    useEffect(() => {
        setIsRunning(true);
        const getScore = async () => {
            const score = {
                token: user.token,
                game: "game1"
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
        getScore();
    }, [user]);

    const saveScore = async () => {
        const score = {
            bestTime: time,
            game: "game1",
            token: user.token
        }
        try {
            await api.post('/score', score)
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        const { target, randomOptions } = generateRandomOptions();
        setTargetLetter(target);
        setOptions(randomOptions)
    }, [score]);

    const handleOptionClick = (selectedLetter) => {
        if (selectedLetter === targetLetter) {
            showWinAlert();
        } else {
            showLoseAlert();
        }
    };

    const handleScrollLeft = () => {
        audioClick.play();
        setScrollPosition(scrollPosition > 0 ? scrollPosition - 1 : options.length - visibleOptions);
    };

    const handleScrollRight = () => {
        audioClick.play();
        setScrollPosition((scrollPosition + 1) % (options.length - visibleOptions + 1));
    };

    const showWinAlert = () => {
        audioWin.play();
        saveScore()
        const html = `<div>
        <p style="font-size: 40px">⭐⭐⭐</p>
        <p style="font-weight: bold; font-size: 20px">¡Felicidades!</p>
        </div>`
        Swal.fire({
            html: html,
            title: '¡Ganaste!',
            text: '¿Quieres jugar de nuevo?',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Salir',
            didOpen: () => {
                confetti({
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
            if (result.value) {
                localStorage.setItem(
                    "aciertosGame1",
                    localStorage.getItem("aciertosGame1")
                        ? parseInt(localStorage.getItem("aciertosGame1")) + 1
                        : 1
                );
                window.location.reload();
                setScore(score + 1);
                setAciertos(aciertos + 1)
                generateRandomOptions();
            } else {
                navigator("/")
            }
        });
    };

    const showLoseAlert = () => {
        audioLose.play();
        Swal.fire({
            title: '¡Perdiste!',
            text: '¿Quieres jugar de nuevo?',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.value) {
                setScore(0);
                generateRandomOptions();
            }
        });
    };


    const visibleOptionList = options.slice(scrollPosition, scrollPosition + visibleOptions);

    return (
        <div className="Game1">
            <div>
                <h1>SEGMENTACIÓN DE SONIDOS</h1>
                <div className="options-container">
                    <div className="options-buttons">
                        <button style={{ background: "#007bff" }} onClick={handleScrollLeft}>&#8249;</button>
                        <div className="options">
                            {visibleOptionList.map((option, index) => (
                                <button key={option.id} onClick={() => handleOptionClick(option)} onMouseEnter={() => playAudio(option.audio)}>
                                    {option.letter}
                                </button>
                            ))}
                        </div>
                        <button style={{ background: "#007bff" }} onClick={handleScrollRight}>&#8250;</button>
                    </div>
                    <h3>Encuentra la letra:</h3>
                    <span id="target-letter">{targetLetter.letter}</span>
                    <div style={{ fontWeight: "bold" }}>Cronómetro: {time} segundos</div>
                    <div style={{ fontWeight: "bold" }}>Mejor tiempo: {bestTime === null ? 'N/A' : `${bestTime} segundos`}</div>
                    <div style={{ fontWeight: "bold" }}>Aciertos: {aciertos === null ? 'N/A' : `${aciertos} `}</div>
                </div>
            </div>
        </div>
    );
}

export default Game1;