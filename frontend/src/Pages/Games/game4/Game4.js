import React, { useState, useEffect, useContext } from "react";
import Card from "./Card";
import card1 from "../../../assets/images/card1.png";
import card2 from "../../../assets/images/card2.png";
import card3 from "../../../assets/images/card3.png";
import card4 from "../../../assets/images/card4.png";
import "./game4.css";
import { AuthContext } from "../../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api"
import Swal from 'sweetalert2';
import confetti from "canvas-confetti";
import soundNoMatch from '../../../assets/sounds/no-match.mp3';
import soundMatch from '../../../assets/sounds/match.wav';
import soundWin from '../../../assets/sounds/win.wav';
import { playAudio } from "../../../services/datosServices";
import perro from "../../../assets/sounds4/perro.mp3"
import gato from "../../../assets/sounds4/gato.mp3"
import jirafa from "../../../assets/sounds4/jirafa.mp3"
import leon from "../../../assets/sounds4/leon.mp3"
import { playAudioFlipcard } from "../../../util/util";

const Game4 = () => {
    const navigator = useNavigate();
    const { user } = useContext(AuthContext);
    const [cards, setCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [time, setTime] = useState(0);
    const [bestTime, setBestTime] = useState(null);
    const [isRunning, setIsRunning] = useState(true);
    const [count, setCount] = useState(null);
    const [score, setScore] = useState(null)
    const [matchTime, setMatchTime] = useState(null);






    const audioNoMatch = new Audio(soundNoMatch);
    const audioMatch = new Audio(soundMatch);
    const audioWin = new Audio(soundWin);



    useEffect(() => {
        const getScore = async () => {
            const score = {
                token: user.token,
                game: "game4"
            }
            try {
                const response = await api.post('/getScore', score)
                if (response.status === 200) {
                    setBestTime(response.data.game.bestTime)
                }
            } catch (error) {
            }
        }
        getScore()
    }, [user]);




    useEffect(() => {
        const initialCards = [
            { name: "gato", image: card1, isFlipped: true, match: false, audio: gato },
            { name: "jirafa", image: card2, isFlipped: true, match: false, audio: jirafa },
            { name: "perro", image: card3, isFlipped: true, match: false, audio: perro },
            { name: "león", image: card4, isFlipped: true, match: false, audio: leon },
        ];
        const duplicatedCards = [...initialCards, ...initialCards].map((card) => ({ ...card }));
        duplicatedCards.sort(() => Math.random() - 0.5);
        setCount(duplicatedCards.length)
        setCards(duplicatedCards);
    }, []);

    useEffect(() => {
        if (cards) {
            setIsRunning(false)
            const timer = setTimeout(() => {
                setCards(prevCards => prevCards.map(card => ({ ...card, isFlipped: false })).sort(() => Math.random() - 0.5));
            }, 2500);
            setIsRunning(true)
            return () => {
                clearTimeout(timer);
            };
        }
    }, [cards]);


    const saveScore = async () => {
        const score = {
            bestTime: time,
            game: "game4",
            token: user.token
        }
        try {
            await api.post('/score', score)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => {
            clearInterval(interval);
        };
    }, [isRunning]);




    const handleCardClick = (index, text) => {
        if (cards[index].isFlipped === false) {
            playAudioFlipcard();
            updateCardState(index, true);
            if (selectedCard === null) {
                setSelectedCard(index);
            } else {
                if (index !== selectedCard) {
                    checkForMatch(selectedCard, index);
                }
            }
        }
    };

    const updateCardState = (index, isFlipped) => {
        const updatedCards = [...cards];
        updatedCards[index].isFlipped = isFlipped;
        setCards(updatedCards);
    };

    const checkForMatch = (index1, index2) => {
        if (cards[index1].name === cards[index2].name) {
            const updatedCards = [...cards];
            updatedCards[index1].match = true;
            updatedCards[index2].match = true;
            setCards(updatedCards);
            setCount(count - 2);

            const matchDuration = time - matchTime;
            const quickMatchThreshold = 5;
            const additionalPoints = matchDuration < quickMatchThreshold ? 10 : 0;
            const newScore = time + additionalPoints;
            setScore(newScore)
            setMatchTime(null);

            if (count === 2) {
                audioWin.play();
                getWin();
            } else {
                audioMatch.play();
            }
            playAudio(cards[selectedCard].audio)
        } else {
            audioNoMatch.play();
            setSelectedCard(null);
            setTimeout(() => {
                updateCardState(index1, false);
                updateCardState(index2, false);
            }, 500);
        }

        setSelectedCard(null);
    };


    const getWin = () => {
        setCount(0)
        Swal.fire({
            html: `<div>
                    <p style="font-weight: bold; font-size: 20px">¡Felicidades! Ganaste en ${time} segundos.</p>
                </div>`,
            confirmButtonText: 'Jugar de Nuevo',
            cancelButtonText: 'Salir',
            showCancelButton: true,
            didOpen: () => {
                confetti({
                    particleCount: 100,
                    startVelocity: 30,
                    spread: 360,
                    origin: {
                        x: 0.5,
                        y: 0.5,
                    },
                    zIndex: 10000,
                });
            },
        }).then((result) => {
            saveScore();
            if (result.isConfirmed) {
                window.location.reload();
            } else {
                navigator("/")
            }
        })

    }

    return (
        <div className="board-game4">
            <div className="game-game4">
                {cards.map((card, index) => (
                    <Card
                        key={index}
                        card={card}
                        isFlipped={card.isFlipped}
                        handleClick={() => handleCardClick(index, card.name)}
                    />
                ))}

            </div>
            <div style={{ fontWeight: "bold" }}>Cronómetro: {time} segundos</div>
            <div style={{ fontWeight: "bold" }}>Mejor puntaje: {score} puntos</div>
            <div style={{ fontWeight: "bold" }}>Mejor tiempo: {bestTime === null ? 'N/A' : `${bestTime} segundos`}</div>
        </div>
    );
};

export default Game4;
