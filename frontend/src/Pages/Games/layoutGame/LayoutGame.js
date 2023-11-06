import React from 'react';
import './layoutGame.css'
import Game1 from "../game1/Game1"
import Game2 from "../game2/Game2"
import Game3 from "../game3/Game3"
import Game4 from "../game4/Game4"

import { useNavigate, useParams } from 'react-router-dom';

const LayoutGame = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const back = () => {
        navigate("/")
    }

    return (
        <div className="brick-wall">
            <div className={id === "game4" ? "center-component-4" : "center-component"}>
                {id === "game1" ? (<Game1 />) : id === "game2" ? (<Game2 />) : id === "game3" ? (<Game3 />) : <Game4 />}
            </div>

            <div className="back-button">
                <button className="large-orange-button" onClick={back} >Regresar</button>
            </div>
        </div>
    );
};

export default LayoutGame;
