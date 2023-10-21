import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Swal from 'sweetalert2';
import './game1.css';

const Game1 = () => {
    const [letters, setLetters] = useState([]);
    const [targetLetter, setTargetLetter] = useState('');
    const [gameResult, setGameResult] = useState(null);
    const [stars, setStars] = useState(0);
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [showPlayButton, setShowPlayButton] = useState(true);
    const [showRules, setShowRules] = useState(true);
    const [wins, setWins] = useState(0);
    const [bestTime, setBestTime] = useState(null);

    const generateRandomLetter = () => {
        const randomCharCode = Math.floor(Math.random() * 26) + 65; // Generates random ASCII code for A to Z
        return String.fromCharCode(randomCharCode);
    };

    const randomizeLetters = () => {
        const randomizedLetters = [];
        for (let i = 0; i < 3; i++) {
            // Distribuye las piezas dentro de un rango más amplio, evitando el centro
            randomizedLetters.push({
                id: i + 1,
                letter: generateRandomLetter(),
                left: Math.random() * 400 + 100, // Ajusta estos valores según tus preferencias
                top: Math.random() * 400 + 100,  // Ajusta estos valores según tus preferencias
            });
        }
        setLetters(randomizedLetters);

        const randomIndex = Math.floor(Math.random() * 3);
        setTargetLetter(randomizedLetters[randomIndex].letter);
        setGameResult(null);
    };
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

    const handlePlay = () => {
        if (showRules) {
            Swal.fire({
                title: '¡Bienvenido al juego!',
                text: 'Arrastra la letra correcta al objetivo. ¡Gana estrellas y diviértete!',
                confirmButtonText: 'Comenzar',
            }).then(() => {
                setShowRules(false);
                randomizeLetters();
                setIsRunning(true);
                setTime(0);
                setShowPlayButton(false);
            });
        } else {
            randomizeLetters();
            setIsRunning(true);
            setTime(0);
            setShowPlayButton(false);
        }
    };

    const handleDrop = (droppedLetter, position) => {
        const gano = droppedLetter === targetLetter;

        const puntuacion = gano ? 3 : 0;
        setStars(puntuacion);

        if (gano) {
            setWins(wins + 1);
            if (bestTime === null || time < bestTime) {
                setBestTime(time);
            }

            Swal.fire({
                html: `<div>
                    <p style="font-size: 40px">⭐⭐⭐</p>
                    <p style="font-weight: bold; font-size: 20px">¡Felicidades! Ganaste en ${time} segundos.</p>
                </div>`,
                confirmButtonText: 'Ok',
            }).then(() => {
                Swal.fire({
                    title: '¿Jugar de nuevo?',
                    showCancelButton: true,
                    confirmButtonText: 'Sí',
                    cancelButtonText: 'No',
                    confirmButtonColor: '#3498db',
                }).then((result) => {
                    if (result.isConfirmed) {
                        handlePlay();
                    }
                });
            });
        } else {
            Swal.fire({
                html: `<p>¡Perdiste! .</p><p>La letra correcta era "${targetLetter}"</p>`,
                confirmButtonText: 'Ok',
            }).then(() => {
                Swal.fire({
                    title: '¿Jugar de nuevo?',
                    showCancelButton: true,
                    confirmButtonText: 'Sí',
                    cancelButtonText: 'No',
                    confirmButtonColor: '#3498db',
                }).then((result) => {
                    if (result.isConfirmed) {
                        handlePlay();
                    }
                });
            });
        }
    };

    return (
        <div>
            <DndProvider backend={HTML5Backend}>
                <div className="board">
                    {showPlayButton ? (
                        <button onClick={handlePlay} className="play-button">
                            Jugar
                        </button>
                    ) : (
                        <>
                            <div
                                className="target"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    const droppedLetter = e.dataTransfer.getData('letter');
                                    handleDrop(droppedLetter);
                                }}
                            >
                                {targetLetter}
                            </div>
                            {letters.map((letterData, index) => (
                                <div
                                    key={letterData.id}
                                    className="piece"
                                    style={{
                                        left: `${letterData.left}px`,
                                        top: `${letterData.top}px`,
                                    }}
                                    onDragStart={(e) => e.dataTransfer.setData('letter', letterData.letter)}
                                    draggable
                                >
                                    <span>{letterData.letter}</span>
                                </div>
                            ))}

                        </>
                    )}
                </div>
                <div>Cronómetro: {time} segundos</div>
                <div>Estrellas: {stars}</div>
                <div>Partidas ganadas: {wins}</div>
                <div>Mejor tiempo: {bestTime === null ? 'N/A' : `${bestTime} segundos`}</div>
                {!showPlayButton && (
                    <button onClick={handlePlay} className="play-button">
                        Reiniciar
                    </button>
                )}
            </DndProvider>
        </div>
    );
};

export default Game1;
