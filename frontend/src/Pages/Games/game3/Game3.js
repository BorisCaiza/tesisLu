import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './game3.css';
import { getrhymingWords } from '../../../services/datosServices';

const Game3 = () => {
    const [targetWord, setTargetWord] = useState(null);
    const [option1, setOption1] = useState(null);
    const [option2, setOption2] = useState(null);
    const [gameResult, setGameResult] = useState(null);
    const orden = Math.random() < 0.5 ? 1 : 2; // Corrected the random number comparison

    const getDatos = () => {
        const [randomWord, randomWordOption1, randomWordOption2] = getrhymingWords();
        setTargetWord(randomWord);
        setOption1(randomWordOption1);
        setOption2(randomWordOption2);
    };

    // Load rhyming words when the component is mounted
    useEffect(() => {
        getDatos();
    }, []);

    return (
        <div>
            <div className="board">
                <div>
                    <h1>{targetWord && targetWord.name}</h1>
                    <h3>Rhymes with...</h3>
                    {orden === 1 ? (
                        <>
                            <button>{option1 && option1.name}</button>
                            <button>{option2 && option2.name}</button>
                        </>
                    ) : (
                        <>
                            <button>{option2 && option2.name}</button>
                            <button>{option1 && option1.name}</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Game3;
