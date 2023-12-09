import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './VideoExplicacion.css';
import { Player } from 'video-react';

import fondo9 from '../../assets/images/Fondos/fondo_9.png';
import fondo10 from '../../assets/images/Fondos/fondo_10.png';
import fondo11 from '../../assets/images/Fondos/fondo_11.png';
import fondo12 from '../../assets/images/Fondos/fondo_12.png';


const backgrounds = [fondo9, fondo10, fondo11, fondo12];

function VideoExplicacion() {
    const { id } = useParams()
    const navigate = useNavigate();
    const [backgroundIndex, setBackgroundIndex] = useState(0);

    useEffect(() => {
        setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, [id]);



    const juegoTitulos = {
        game1: "SEGMENTACIÓN DE SONIDOS",
        game2: "CONCIENCIA DE SILABAS",
        game3: "CONCIENCIA DE RIMAS",
        game4: "SIMILITUDES FONÉTICAS"
    };

    const videoUrls = {
        game1: "https://drive.google.com/uc?id=1ImahWVbBxNdKEVHdqT7T8V16phPtMdvA",
        game2: "https://drive.google.com/uc?id=1vuQsso1vGu9yIp7CvgEROF54TgW5AFO9",
        game3: "https://drive.google.com/uc?id=1Jt4XXMdrmWmUBm3CjEMX_zbWymovejgg",
        game4: "https://drive.google.com/uc?id=1ieP3K7S-Va-44JFPPwWAQRz9MFzdDEqk"
    };
    const next = () => {
        navigate("/")
    }
    const back = () => {
        navigate("/games/" + id)
    }

    const titulo = juegoTitulos[id] || "Cargando titulo";
    const videoSrc = videoUrls[id] || "";

    return (

        <div className="video-explicacion">
            <div className="video-explicacion__background" style={{ backgroundImage: `url(${backgrounds[backgroundIndex]})` }}>
                <div className="video-explicacion__content">
                    <h1 className="video-explicacion__title">{titulo}</h1>
                    <div>
                        <Player autoPlay>
                            <source src={videoSrc} />
                        </Player>
                    </div>
                    <div className="video-explicacion__buttons">
                        <button className="video-explicacion__button" onClick={next}>Regresar</button>
                        <button className="video-explicacion__button" style={{ backgroundColor: "#e4800e" }} onClick={back}>Continuar</button>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default VideoExplicacion;
