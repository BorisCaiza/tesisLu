import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './game4.css';
import Card from './Card';

const cards = ['card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1'];

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

const Game4 = () => {
    const [shuffledCards, setShuffledCards] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState(0);

    useEffect(() => {
        setShuffledCards(shuffleArray(cards.concat(cards)));
    }, []);

    const handleCardClick = (card) => {
        if (selectedCards.length === 2) {
            // Si ya hay 2 cartas seleccionadas, no hacer nada.
            return;
        }

        if (selectedCards.length === 1 && selectedCards[0] === card) {
            // Si se hace clic en la misma carta dos veces, no hacer nada.
            return;
        }

        setSelectedCards([...selectedCards, card]);

        if (selectedCards.length === 1) {
            // Comprobar si las dos cartas coinciden.
            if (shuffledCards[selectedCards[0]] === shuffledCards[card]) {
                setMatchedPairs(matchedPairs + 1);
                setSelectedCards([]);
            } else {
                // Si las cartas no coinciden, esperar un segundo y luego ocultarlas.
                setTimeout(() => {
                    setSelectedCards([]);
                }, 1000);
            }
        }
    };


    return (

        <div className="board-game">
            {shuffledCards.map((card, index) => (
                <Card
                    key={index}
                    card={card}
                    onClick={handleCardClick}
                    isFlipped={selectedCards.includes(index)}
                />
            ))}
            {matchedPairs === 8 && <div className="message-game">¡Has ganado!</div>}
        </div>
    );
};

export default Game4;
