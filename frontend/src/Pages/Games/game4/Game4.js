import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import Card from "./Card";
import card1 from "../../../assets/images/card1.png";
import card2 from "../../../assets/images/card2.png";
import card3 from "../../../assets/images/card3.png";
import card4 from "../../../assets/images/card4.png";
import "./game4.css";
import { useNavigate } from "react-router-dom";
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
import { getScore, saveScore } from "../../../services/service";

const Game4 = () => {
    const navigator = useNavigate();
    const { user } = useContext(AuthContext);
    const [cards, setCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [time, setTime] = useState(0);
    const [bestTime, setBestTime] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [count, setCount] = useState(null);
    const [matchTime, setMatchTime] = useState(null);
    const [showCards, setShowCards] = useState(true);
    const [aciertos, setAciertos] = useState(0);


    const audioNoMatch = new Audio(soundNoMatch);
    const audioMatch = new Audio(soundMatch);
    const audioWin = new Audio(soundWin);

    useEffect(() => {
        const fetchBestTime = async () => {
            try {
                const bestTime = await getScore(user);
                setBestTime(bestTime);
            } catch (error) {
                console.error("Error fetching best time:", error);
            }
        };
        fetchBestTime();
    }, [user]);


    const getInitalCards = () => {
        const initialCards = [
            { name: "gato", image: card1, isFlipped: false, match: false, audio: gato },
            { name: "jirafa", image: card2, isFlipped: false, match: false, audio: jirafa },
            { name: "perro", image: card3, isFlipped: false, match: false, audio: perro },
            { name: "león", image: card4, isFlipped: false, match: false, audio: leon },
        ];
        const duplicatedCards = [...initialCards, ...initialCards].map((card) => ({ ...card }));
        duplicatedCards.sort(() => Math.random() - 0.5);
        return duplicatedCards;
    }


    useEffect(() => {
        const initialCards = getInitalCards();
        setCount(initialCards.length);
        setCards(initialCards);

        const displayDuration = 5000;

        setIsRunning(false);

        const displayTimer = setTimeout(() => {
            setShowCards(false);
            setCards(initialCards);//            setCards( getInitalCards()); //si quieren para que sea aleatorio al momento de mostrar las cartas
            setIsRunning(true);
        }, displayDuration);

        return () => {
            clearTimeout(displayTimer);
        };
    }, []);

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
        if (!showCards && cards[index].isFlipped === false) {
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
            setAciertos(aciertos + 1)
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
            title: '¡Ganaste!',
            html: `<div>
            <p style="font-size: 40px">⭐⭐⭐</p>
            <p style="font-weight: bold; font-size: 20px">¡Felicidades!</p>
            </div>`,
            icon: 'success',
            confirmButtonText: '<i class="fa fa-play"></i> Continuar', confirmButtonColor: "#e4800e",
            cancelButtonText: `<i class="fa fa-times"></i> Salir`,
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
            saveScore(time, "game4", user.token)
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
                        isFlipped={showCards || card.isFlipped}
                        handleClick={() => handleCardClick(index, card.name)}
                    />
                ))}
            </div>
            <div style={{ fontWeight: "bold" }}>Cronómetro: {time} segundos</div>
            <div style={{ fontWeight: "bold" }}>Mejor tiempo: {bestTime === null ? 'N/A' : `${bestTime} segundos`}</div>
            <div style={{ fontWeight: "bold" }}>Aciertos: {aciertos === null ? 'N/A' : `${aciertos} `}</div>
        </div>
    );
};

export default Game4;
