import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './game3.css';
import { getrhymingWords } from '../../../services/datosServices';

const Game3 = () => {
    const [targetWord, setTargetWord] = useState(null);
    const [optionCorrectSelect, setOptionCorrectSelect] = useState(null);
    const [optionIncorrectSelect, setOptionIncorrectSelect] = useState(null);
    const [gameResult, setGameResult] = useState(null);
    const orden = Math.random() < 0.5 ? 1 : 2;

    const getDatos = () => {
        const [randomWord, optionCorrect, optionIncorrect] = getrhymingWords();
        setTargetWord(randomWord);
        setOptionCorrectSelect(optionCorrect);
        setOptionIncorrectSelect(optionIncorrect);
    };

    useEffect(() => {
        getDatos();
    }, []);

    const handleOptionSelect = (selectedOption) => {
        if (selectedOption.name === optionCorrectSelect.name) {
            // El jugador ha ganado
            Swal.fire({
                title: '¡Ganaste!',
                text: '¡Bien hecho! La palabra rima correctamente.',
                icon: 'success',
                showCancelButton: true,
                cancelButtonText: 'Volver a jugar',
            }).then((result) => {
                if (result.isConfirmed) {
                    getDatos();
                }
            });
        } else {
            // El jugador ha perdido
            Swal.fire({
                title: 'Perdiste',
                text: 'La palabra seleccionada no rima correctamente.',
                icon: 'error',
                showCancelButton: true,
                cancelButtonText: 'Volver a jugar',
            }).then((result) => {
                if (result.isConfirmed) {
                    getDatos();
                }
            });
        }
    };

    return (
        <div className="board">
            <div>
                <h1>{targetWord && targetWord.name}</h1>
                <h3>Rhymes with...</h3>
                <div className="button-container">
                    {orden === 1 ? (
                        <>
                            <button onClick={() => handleOptionSelect(optionIncorrectSelect)}>
                                <img src="ruta_imagen_incorrecta.png" alt="Option Incorrect" />
                            </button>
                            <button onClick={() => handleOptionSelect(optionCorrectSelect)}>
                                <img src="ruta_imagen_correcta.png" alt="Option Correct" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => handleOptionSelect(optionCorrectSelect)}>
                                <img src="ruta_imagen_correcta.png" alt="Option Correct" />
                            </button>
                            <button onClick={() => handleOptionSelect(optionIncorrectSelect)}>
                                <img src="ruta_imagen_incorrecta.png" alt="Option Incorrect" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Game3;
