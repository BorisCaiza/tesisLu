import React from 'react';
import './layoutGame.css'
import Game1 from "../game1/Game1"
import Game2 from "../game2/Game2"
import Game3 from "../game3/Game3"

const LayoutGame = () => {
    return (
        <div className="brick-wall">
            <div className="center-component">
                <Game1 />
            </div>

            <div className="back-button">
                <button className="large-orange-button">Regresar</button>
            </div>
        </div>
    );
};

export default LayoutGame;
