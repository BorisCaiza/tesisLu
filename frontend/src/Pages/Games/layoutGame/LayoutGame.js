import React, { useEffect, useState } from 'react';
import './layoutGame.css';
import Game1 from '../game1/Game1';
import Game2 from '../game2/Game2';
import Game3 from '../game3/Game3';
import Game4 from '../game4/Game4';

import { useNavigate, useParams } from 'react-router-dom';


import fondo1 from '../../../assets/images/Fondos/fondo 1.png';
import fondo2 from '../../../assets/images/Fondos/fondo 2.png';
import fondo3 from '../../../assets/images/Fondos/fondo 3.png';
import fondo4 from '../../../assets/images/Fondos/fondo 4.png';
import fondo5 from '../../../assets/images/Fondos/fondo 5.png';
import fondo6 from '../../../assets/images/Fondos/fondo 6.png';
import fondo7 from '../../../assets/images/Fondos/fondo 7.png';
import fondo8 from '../../../assets/images/Fondos/fondo 8.png';
import fondo9 from '../../../assets/images/Fondos/fondo 9.png';
import fondo10 from '../../../assets/images/Fondos/fondo 10.png';
import fondo11 from '../../../assets/images/Fondos/fondo 11.png';
import fondo12 from '../../../assets/images/Fondos/fondo 12.png';

const backgrounds = [fondo1, fondo2, fondo3, fondo4, fondo5, fondo6, fondo7, fondo8, fondo9, fondo10, fondo11, fondo12 ];


const LayoutGame = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [backgroundIndex, setBackgroundIndex] = useState(0);

    useEffect(() => {
        console.log('Cambiando fondo...');
        setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, [id]);

    console.log('background:', backgrounds[backgroundIndex]);

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
