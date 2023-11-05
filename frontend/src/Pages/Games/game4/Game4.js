import React, { useState, useEffect } from "react";
import Card from "./Card";
import card1 from "../../../assets/images/card1.png";
import card2 from "../../../assets/images/card2.png";
import card3 from "../../../assets/images/card3.png";
import card4 from "../../../assets/images/card4.png";
import "./game4.css";

const Game4 = () => {
    const initialCards = [
        { name: "Card1", image: card1 },
        { name: "Card2", image: card2 },
        { name: "Card3", image: card3 },
        { name: "Card4", image: card4 },
    ];

    const [cards, setCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);

    useEffect(() => {
        const duplicatedCards = [...initialCards, ...initialCards].map((card) => ({ ...card }));
        duplicatedCards.sort(() => Math.random() - 0.5);
        setCards(duplicatedCards);
    }, []);

    const handleCardClick = (index) => {
        updateCardState(index, true);
        if (selectedCard === null) {
            setSelectedCard(index);
        } else {
            checkForMatch(selectedCard, index);
        }
    };

    const updateCardState = (index, isFlipped) => {
        const updatedCards = [...cards];
        updatedCards[index].isFlipped = isFlipped;
        setCards(updatedCards);
    };

    const checkForMatch = (index1, index2) => {
        if (cards[index1].name === cards[index2].name) {
            const updatedCards = [...cards];
            updatedCards[index1].match = true;
            updatedCards[index2].match = true;
            setCards(updatedCards);
        } else {
            setTimeout(() => {
                updateCardState(index1, false);
                updateCardState(index2, false);
            }, 1000);
        }
        setSelectedCard(null);
    };

    return (
        <div className="game-game4">
            {cards.map((card, index) => (
                <Card
                    key={index}
                    card={card}
                    isFlipped={card.isFlipped}
                    handleClick={() => handleCardClick(index)}
                />
            ))}
        </div>
    );
};

export default Game4;
