import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import "./Game1.css"

function Game1() {
    const [targetLetter, setTargetLetter] = useState('');
    const [options, setOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [visibleOptions, setVisibleOptions] = useState(4);
    const [scrollPosition, setScrollPosition] = useState(0);

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    useEffect(() => {
        generateRandomOptions();
    }, [score]);

    const generateRandomOptions = () => {
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
    };

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
                <h2>Puntuación: {score}</h2>
                <div className="options-container">
                    <div className="options-buttons">
                        <button onClick={handleScrollLeft}>&#8249;</button>
                        <div className="options">
                            {visibleOptionList.map((option, index) => (
                                <button key={index} onClick={() => handleOptionClick(option)}>
                                    {option}
                                </button>
                            ))}
                        </div>
                        <button onClick={handleScrollRight}>&#8250;</button>
                    </div>
                    <h1>Encuentra la letra:</h1>
                    <span id="target-letter">{targetLetter}</span>
                </div>
            </div>
        </div>
    );
}

export default Game1;
