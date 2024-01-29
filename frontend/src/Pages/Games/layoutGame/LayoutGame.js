import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './layoutGame.css';
import Game1 from '../game1/Game1';
import Game2 from '../game2/Game2';
import Game3 from '../game3/Game3';
import Game4 from '../game4/Game4';
import { Player } from 'video-react';
import tuto1 from "../../../assets/tutoriales/Tutorial_1_Segmentación de sonidos.mp4"
import tuto2 from "../../../assets/tutoriales/Tutorial_2_Conciencia de sílabas.mp4"
import tuto3 from "../../../assets/tutoriales/Tutorial_3_Conciencia de Rimas.mp4"
import tuto4 from "../../../assets/tutoriales/Tutorial_4_Similitudes Fonéticas.mp4"
import soundClick from "../../../assets/sounds/click.wav"


import { useNavigate, useParams } from 'react-router-dom';

import fondo3 from "../../../assets/images/Fondos/fondo_3.png";
import fondo4 from "../../../assets/images/Fondos/fondo_4.png";
import fondo5 from "../../../assets/images/Fondos/fondo_5.png";
import fondo6 from "../../../assets/images/Fondos/fondo_6.png";
import fondo7 from "../../../assets/images/Fondos/fondo_7.png";
import fondo8 from '../../../assets/images/Fondos/fondo_8.png';

const backgrounds = [fondo3, fondo4, fondo5, fondo6, fondo7, fondo8];

const LayoutGame = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [backgroundIndex, setBackgroundIndex] = useState(0);
    const [showInstructions, setShowInstructions] = useState(false);

    const audioClick = new Audio(soundClick);

    useEffect(() => {
        setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, [id]);

    const back = () => {
        audioClick.play();
        navigate(`/video/${id}`);
    };

    const openInstructions = () => {
        audioClick.play();
        setShowInstructions(true);
    };

    const closeInstructions = () => {
        audioClick.play();
        setShowInstructions(false);
    };

    const videoUrls = {
        game1: tuto1,
        game2: tuto2,
        game3: tuto3,
        game4: tuto4
    };

    const videoSrc = videoUrls[id] || "";

    return (
        <div className="brick-wall" style={{ backgroundImage: `url(${backgrounds[backgroundIndex]})` }}>
            <div className="center-component">
                {id === 'game1' ? <Game1 /> : id === 'game2' ? <Game2 /> : id === 'game3' ? <Game3 /> : <Game4 />}
            </div>
            <div className="back-button">
                <button className="large-orange-button" onClick={back}>
                    Regresar
                </button>
            </div>
            <div className="instructions-button">
                <button className="large-blue-button" onClick={openInstructions}>
                    ¿Cómo jugar?
                </button>
            </div>

            <Modal show={showInstructions} onHide={closeInstructions}>
                <Modal.Header closeButton>
                    <Modal.Title>Tutorial</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Player autoPlay>
                        <source src={videoSrc} />
                    </Player>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" style={{ background: "orange", border: "none" }} onClick={closeInstructions}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default LayoutGame;
