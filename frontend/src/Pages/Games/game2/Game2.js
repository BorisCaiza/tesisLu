import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './game2.css';
import { getWordsData } from '../../../services/datosServices';
import altavoz from "../../../assets/altavoz.png"

const Game2 = () => {
    const [word, setWord] = useState(null);
    const [showPlayAgainButton, setShowPlayAgainButton] = useState(false);

    const getWord = () => {
        const words = getWordsData();
        const randomIndex = Math.floor(Math.random() * words.length);
        const randomWord = words[randomIndex];
        setWord(randomWord);
    }

    useEffect(() => {
        getWord()
    }, []);

    const speak = () => {
        if (word) {
            const syllables = word.syllable_separation.split('-');
            
            const speechParts = syllables.map((syllable, index) => {
                const utterance = new SpeechSynthesisUtterance(syllable);
                utterance.pause = index < syllables.length - 1 ? 100 : 0;
                return utterance;
            });
    
            speechParts.forEach(part => {
                window.speechSynthesis.speak(part);
            });
        }
    }
    




    const handleDrop = (droppedLetter) => {
        if (droppedLetter === word.word) {
            Swal.fire({
                icon: 'success',
                title: 'Correcto',
                text: `¡La palabra "${word.word}" es correcta!`,
            });
            setShowPlayAgainButton(true);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Incorrecto',
                text: 'La letra soltada no coincide con la palabra.',
            });
        }
    }

    return (
        <div>
            <DndProvider backend={HTML5Backend}>
                <div className="targetWord">targetWord</div>
                <div className="center">
                    <div className="title">
                        {word ? word.word : ''}
                    </div>
                    <div className="speaker-button">
                        <img src={altavoz} className="altavoz-btn" onClick={speak} alt='altavoz' />
                    </div>
                    <div className="syllable-separation">
                        <h2>Separación de sílabas</h2>
                        <h5>{word ? word.syllable_separation : ''}</h5>
                    </div>
                </div>
                {!showPlayAgainButton ? (
                    <div
                        className="piece"
                        onDragStart={(e) => e.dataTransfer.setData('word', word ? word.word : '')}
                        draggable
                    >
                        <span>{word ? word.word : ''}</span>
                    </div>
                ) : <button onClick={getWord}>Jugar Nuevamente</button>}
            </DndProvider>
        </div>
    );
};

export default Game2;
