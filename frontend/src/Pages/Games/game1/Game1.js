import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import confetti from "canvas-confetti"
import "./Game1.css"
import { generateRandomOptions, playAudio } from '../../../services/datosServices';
import soundNoMatch from '../../../assets/sounds/no-match.mp3';
import soundWin from '../../../assets/sounds/win.wav';
import soundClick from "../../../assets/sounds/click.wav"
import { useNavigate } from 'react-router-dom';

function Game1() {
    const navigator = useNavigate();
    const [targetLetter, setTargetLetter] = useState('');
    const [options, setOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [scrollPosition, setScrollPosition] = useState(0);
    const visibleOptions = 4;

    const audioLose = new Audio(soundNoMatch);
    const audioWin = new Audio(soundWin);
    const audioClick = new Audio(soundClick);


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
        const html = `<div>
        <p style="font-size: 40px">⭐⭐⭐</p>
        <p style="font-weight: bold; font-size: 20px">¡Felicidades! Ganaste con ${score} puntos .</p>
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
                setScore(score + 1);
                generateRandomOptions();
            }else{
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
                <h2>Puntuación: {score}</h2>
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
                </div>
            </div>
        </div>
    );
}

export default Game1;
