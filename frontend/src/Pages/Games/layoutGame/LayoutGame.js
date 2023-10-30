import React from 'react';
import './layoutGame.css'
import Game1 from "../game1/Game1"
import Game2 from "../game2/Game2"
import Game3 from "../game3/Game3"
import { useNavigate, useParams } from 'react-router-dom';

const LayoutGame = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const back = () => {
       // navigate("/video/"+id)
       navigate("/games")
    }

    return (
        <div className="brick-wall">
            <div className="center-component">
                {id === "game1" ? (<Game1 />): id === "game2" ? (<Game2 />):(<Game3 />)}
            </div>

            <div className="back-button">
                <button className="large-orange-button" onClick={back} >Regresar</button>
            </div>
        </div>
    );
};

export default LayoutGame;
