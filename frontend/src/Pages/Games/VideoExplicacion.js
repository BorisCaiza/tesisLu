import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import YouTube from 'react-youtube';
import './VideoExplicacion.css';

import fondo9 from '../../assets/images/Fondos/fondo_9.png';
import fondo10 from '../../assets/images/Fondos/fondo_10.png';
import fondo11 from '../../assets/images/Fondos/fondo_11.png';
import fondo12 from '../../assets/images/Fondos/fondo_12.png';

const backgrounds = [fondo9, fondo10, fondo11, fondo12 ];

function VideoExplicacion() {
    const { id } = useParams()
    const videoId = 'dQw4w9WgXcQ';
    const navigate = useNavigate();
    const [backgroundIndex, setBackgroundIndex] = useState(0);

    const videoOptions = {
        height: '390',
        width: '640',
        playerVars: {
            autoplay: 1,
            showinfo: 0,
        },
    };
    

    useEffect(() => {
        console.log('Cambiando fondo...');
        setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, [id]);



    const juegoTitulos = {
        game1: "Segmentación de sonidos",
        game2: "Conciencia de sílabas",
        game3: "Conciencia de rima",
        game4: "Juego de Memoria"
    };
    const next = () => {
        navigate("/")
    }
    const back = () => {
        navigate("/games/"+id)
    }
    const titulo = juegoTitulos[id] || "Título por defecto";

    return (
        <div className="video-explicacion">
            <div className="video-explicacion__background" style={{ backgroundImage: `url(${backgrounds[backgroundIndex]})` }}>
                <div className="video-explicacion__content">
                    <h1 className="video-explicacion__title">{titulo}</h1>
                    <div className="video-explicacion__video">
                        <YouTube videoId={videoId} opts={videoOptions} />
                    </div>
                    <div className="video-explicacion__buttons">
                        <button className="video-explicacion__button" onClick={next}>Regresar</button>
                        <button className="video-explicacion__button" style={{ backgroundColor: "#e4800e" } } onClick={back}>Continuar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoExplicacion;
