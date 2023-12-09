import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './VideoExplicacion.css';

import fondo9 from '../../assets/images/Fondos/fondo_9.png';
import fondo10 from '../../assets/images/Fondos/fondo_10.png';
import fondo11 from '../../assets/images/Fondos/fondo_11.png';
import fondo12 from '../../assets/images/Fondos/fondo_12.png';

import Header from '../../Compoments/Header';

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

    const refuersosUtls = {
        game1: ["https://view.genial.ly/656ebb738ea79a0014c156de/interactive-image-segmentacion-de-sonidos", "https://es.educaplay.com/recursos-educativos/17206617-silabas_con_m.html"],
        game2: ["https://www.canva.com/design/DAF2QF3FR8U/t4NxuEPpa66BYDXU5rEVzA/edit?utm_content=DAF2QF3FR8U&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton", "https://es.educaplay.com/recursos-educativos/17206830-conciencia_de_silabas.html"],
        game3: ["https://www.canva.com/design/DAF2PnWOF3c/vs0b3MZEGKP6ClTfBDm8ZA/edit?utm_content=DAF2PnWOF3c&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton", "https://es.educaplay.com/recursos-educativos/17227670-juego_de_memoria_rim.html"],
        game4: ["https://www.canva.com/design/DAF2QtiBbWs/4weww45vcZ6GoueenF30JQ/edit?utm_content=DAF2QtiBbWs&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton", "https://es.educaplay.com/recursos-educativos/17228167-similitudes_foneticas.html "]

    }

    const next = () => {
        navigate("/")
    }
    const back = () => {
        navigate("/games/" + id)
    }

    const titulo = juegoTitulos[id] || "Cargando titulo";
    const videoSrc = videoUrls[id] || "";
    const linksSrc = refuersosUtls[id] || "";

    return (

        <div className="video-explicacion">
            <div className="video-explicacion__background" style={{ backgroundImage: `url(${backgrounds[backgroundIndex]})` }}>
                <div className="video-explicacion__content">
                    <h1 className="video-explicacion__title">{titulo}</h1>
                    <div>

                    </div>
                    <div className="video-explicacion__buttons">
                        <button className="video-explicacion__button" onClick={next}>Regresar</button>
                        <button className="video-explicacion__button" style={{ backgroundColor: "#e4800e" }} onClick={back}>Continuar</button>
                        <a href={linksSrc[0]} target="_blank"> <button className='video-explicacion__button' >Refuerzo Genially</button> </a>
                        <a href={linksSrc[1]} target="_blank">
                            <button className="video-explicacion__button" style={{ backgroundColor: "#e4800e" }}>
                                Refuerzo EducaPlay
                            </button>
                        </a>

                    </div>
                </div>
            </div>
        </div>

    );
}

export default VideoExplicacion;
