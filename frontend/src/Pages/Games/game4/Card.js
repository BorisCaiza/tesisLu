import React from 'react';
import './game4.css';

function Card({ card, onClick, isFlipped }) {
    return (
        <div
            className={`card-game ${isFlipped ? 'flipped-game' : ''}`}
            onClick={() => onClick(card)}
        >
            <div className="card-inner-game">
                <div className="card-front-game">
                    <img src={`../../../assets/images/${card}.png`} alt={card} width="100%" height="100%" />
                </div>
                <div className="card-back-game">
                    <img src="../../../assets/images/back.png" alt="back" width="100%" height="100%" />
                </div>
            </div>
        </div>
    );
}

export default Card;
