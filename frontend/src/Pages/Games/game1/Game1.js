import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import confetti from "canvas-confetti"
import "./Game1.css"

function Game1() {
    const [targetLetter, setTargetLetter] = useState('');
    const [options, setOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [scrollPosition, setScrollPosition] = useState(0);
    const visibleOptions = 4;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const generateRandomOptions = useCallback(() => {
        const randomOptions = [];
        const randomIndex = Math.floor(Math.random() * letters.length);
        setTargetLetter(letters[randomIndex]);
        randomOptions.push(letters[randomIndex]);

        while (randomOptions.length < 10) {
            const randomIndex = Math.floor(Math.random() * letters.length);
            const randomLetter = letters[randomIndex];
            if (!randomOptions.includes(randomLetter) && randomLetter !== targetLetter) {
                randomOptions.push(randomLetter);
            }
        }
        randomOptions.sort(() => Math.random() - 0.5);
        setOptions(randomOptions);
    }, [targetLetter]);

    useEffect(() => {
        generateRandomOptions();

    }, [score, generateRandomOptions]);

    const handleOptionClick = (selectedLetter) => {
        if (selectedLetter === targetLetter) {
            showWinAlert();
        } else {
            showLoseAlert();
        }
    };

    const handleScrollLeft = () => {
        setScrollPosition(scrollPosition > 0 ? scrollPosition - 1 : options.length - visibleOptions);
    };

    const handleScrollRight = () => {
        setScrollPosition((scrollPosition + 1) % (options.length - visibleOptions + 1));
    };

    const showWinAlert = () => {
        Swal.fire({
            title: '¡Ganaste!',
            text: '¿Quieres jugar de nuevo?',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
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
            }
        });
    };

    const showLoseAlert = () => {
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
                                <button key={index} onClick={() => handleOptionClick(option)}>
                                    {option}
                                </button>
                            ))}
                        </div>
                        <button style={{ background: "#007bff" }} onClick={handleScrollRight}>&#8250;</button>
                    </div>
                    <h3>Encuentra la letra:</h3>
                    <span id="target-letter">{targetLetter}</span>
                </div>
            </div>
        </div>
    );
}

export default Game1;
