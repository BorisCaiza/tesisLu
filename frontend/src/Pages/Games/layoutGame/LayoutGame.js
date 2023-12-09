import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
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

const backgrounds = [fondo3, fondo4, fondo5, fondo6, fondo7, fondo8];

const LayoutGame = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [backgroundIndex, setBackgroundIndex] = useState(0);
    const [showInstructions, setShowInstructions] = useState(false);

    useEffect(() => {
        setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, [id]);

    const back = () => {
        navigate('/');
    };

    const openInstructions = () => {
        setShowInstructions(true);
    };

    const closeInstructions = () => {
        setShowInstructions(false);
    };

    const videoUrls = {
        game1: "https://drive.google.com/uc?id=1ImahWVbBxNdKEVHdqT7T8V16phPtMdvA",
        game2: "https://drive.google.com/uc?id=1vuQsso1vGu9yIp7CvgEROF54TgW5AFO9",
        game3: "https://drive.google.com/uc?id=1Jt4XXMdrmWmUBm3CjEMX_zbWymovejgg",
        game4: "https://drive.google.com/uc?id=1ieP3K7S-Va-44JFPPwWAQRz9MFzdDEqk"
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
