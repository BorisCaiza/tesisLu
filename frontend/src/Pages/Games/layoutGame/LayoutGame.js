import React, { useEffect, useState } from 'react';
import './layoutGame.css';
import Game1 from '../game1/Game1';
import Game2 from '../game2/Game2';
import Game3 from '../game3/Game3';
import Game4 from '../game4/Game4';

import { useNavigate, useParams } from 'react-router-dom';



import fondo3 from "../../../assets/images/Fondos/fondo_3.png";
import fondo4 from "../../../assets/images/Fondos/fondo_4.png";
import fondo5 from "../../../assets/images/Fondos/fondo_5.png";
import fondo6 from "../../../assets/images/Fondos/fondo_6.png";
import fondo7 from "../../../assets/images/Fondos/fondo_7.png";
import fondo8 from '../../../assets/images/Fondos/fondo_8.png';

const backgrounds = [fondo3, fondo4, fondo5, fondo6, fondo7, fondo8 ];


const LayoutGame = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [backgroundIndex, setBackgroundIndex] = useState(0);

    useEffect(() => {
        console.log('Cambiando fondo...');
        setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, [id]);


    const back = () => {
        navigate('/');
    };

    return (
        <div className="brick-wall" style={{ backgroundImage: `url(${backgrounds[backgroundIndex]})` }}>
            <div className={id === 'game4' ? 'center-component-4' : 'center-component'}>
                {id === 'game1' ? <Game1 /> : id === 'game2' ? <Game2 /> : id === 'game3' ? <Game3 /> : <Game4 />}
            </div>

            <div className="back-button">
                <button className="large-orange-button" onClick={back}>
                    Regresar
                </button>
            </div>
        </div>
    );
};

export default LayoutGame;
