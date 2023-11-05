import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './game3.css';
import { getrhymingWords } from '../../../services/datosServices';

const Game3 = () => {
    const [targetWord, setTargetWord] = useState({});
    const [optionCorrectSelect, setOptionCorrectSelect] = useState({});
    const [optionIncorrectSelect, setOptionIncorrectSelect] = useState({});
    const [gameResult, setGameResult] = useState(null);
    const orden = Math.random() < 0.5 ? 1 : 2;

    const getDatos = () => {
        const { palabra, rima, seleccionAleatoria } = getrhymingWords();
        console.log(`Palabra Aleatoria: ${palabra}`);
        setTargetWord(palabra);
        setOptionCorrectSelect(rima);
        setOptionIncorrectSelect(seleccionAleatoria);
    };

    useEffect(() => {
        getDatos();
    }, []);

    const handleOptionSelect = (selectedOption) => {
        if (selectedOption.name === optionCorrectSelect.name) {
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
                <img src={targetWord.image} alt="Option" style={{height: 75}} />
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
        </div>
    );
};

export default Game3;
