import React, { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './game2.css';
import { wordsDataService } from '../../../services/datosServices';
import altavoz from "../../../assets/altavoz.png"
import { AuthContext } from '../../../Context/AuthContext';
import api from "../../../api/api"

const Game2 = () => {
    const { user } = useContext(AuthContext);
    const [word, setWord] = useState(null);
    const [showPlayAgainButton, setShowPlayAgainButton] = useState(false);
    const [bestTime, setBestTime] = useState(null);
    const [time, setTime] = useState(0);




    const getWord = () => {
        const words = wordsDataService();
        const randomIndex = Math.floor(Math.random() * words.length);
        const randomWord = words[randomIndex];
        setWord(randomWord);
    }

    const getScore = async () => {

        const score = {

            token: user.token,
            game: "game2"

        }

        try {

            const response = await api.post('/getScore', score)

            if (response.status === 200) {
                setBestTime(response.data.game.bestTime)
            }
        } catch (error) {

        }

    }

    const saveScore = async () => {




        const score = {
            bestTime: bestTime,
            game: "game2",
            token: user.token
        }

        try {

            const response = await api.post('/score', score)

        } catch (error) {

        }
    }

    useEffect(() => {
        getWord()
        getScore()
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
                <div className=".target-word ">targetWord</div>
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
                        className="piece-word"
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
