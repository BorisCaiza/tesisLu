import React from "react";
import back from "../../../assets/images/back.png";
import "./game4.css";

const Card = ({ card, isFlipped, handleClick }) => {
    return (
        <div
            className={`card-game4 ${isFlipped ? "flipped-game4" : ""}`}
            onClick={handleClick}
        >
            <img
                src={isFlipped ? card.image : back}
                alt={card.name}
            />
            {card.match && (
                <div className="checkmark-overlay">✔</div>
            )}
        </div>
    );
};

export default Card;
