import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import YouTube from 'react-youtube';
import './VideoExplicacion.css';

function VideoExplicacion() {
    const { id } = useParams()
    const videoId = 'dQw4w9WgXcQ';
    const navigate = useNavigate();

    const videoOptions = {
        height: '390',
        width: '640',
        playerVars: {
            autoplay: 1,
            showinfo: 0,
        },
    };

    const juegoTitulos = {
        game1: "Segmentación de sonidos",
        game2: "Conciencia de sílabas",
        game3: "Conciencia de rima",
        game4: "Puzzle"
    };
    const next = () => {
        navigate("/games")
    }
    const back = () => {
        navigate("/games/"+id)
    }
    const titulo = juegoTitulos[id] || "Título por defecto";

    return (
        <div className="video-explicacion">
            <div className="video-explicacion__background">
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
