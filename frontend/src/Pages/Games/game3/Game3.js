import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './game3.css';
import { getrhymingWords } from '../../../services/datosServices';

const Game3 = () => {
    const [targetWord, setTargetWord] = useState(null);
    const [optionCorrect, setOptionCorrect] = useState(null);
    const [optionIncorrect, setOptionIncorrect] = useState(null);
    const [gameResult, setGameResult] = useState(null);
    const orden = Math.random() < 0.5 ? 1 : 2;

    const getDatos = () => {
        const [randomWord, randomWordOption1, randomWordOption2] = getrhymingWords();
        setTargetWord(randomWord);
        setOptionCorrect(randomWordOption1);
        setOptionIncorrect(randomWordOption2);
    };

    useEffect(() => {
        getDatos();
    }, []);

    const handleOptionSelect = (selectedOption) => {
        if (selectedOption === optionCorrect) {
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
        <div>
            <div className="board">
                <div>
                    <h1>{targetWord && targetWord.name}</h1>
                    <h3>Rhymes with...</h3>
                    {orden === 1 ? (
                        <>
                            <button onClick={() => handleOptionSelect(optionIncorrect)}>{optionCorrect && optionCorrect.name}</button>
                            <button onClick={() => handleOptionSelect(optionCorrect)}>{optionIncorrect && optionIncorrect.name}</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => handleOptionSelect(optionIncorrect)}>{optionIncorrect && optionIncorrect.name}</button>
                            <button onClick={() => handleOptionSelect(optionCorrect)}>{optionCorrect && optionCorrect.name}</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Game3;
