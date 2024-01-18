import React, { useState, useEffect, useContext, useRef, useMemo, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate } from 'react-router-dom';
import './game2.css';
import altavoz from "../../../assets/altavoz.png"
import { getWord, playAudio, wordsDataService } from '../../../services/datosServices';
import { AuthContext } from '../../../Context/AuthContext';
import api from "../../../api/api"
import Swal from 'sweetalert2';
import confetti from "canvas-confetti"
import soundNoMatch from '../../../assets/sounds/no-match.mp3';
import soundWin from '../../../assets/sounds/win.wav';


const Game2 = () => {
    const navigator = useNavigate();
    const { user } = useContext(AuthContext);
    const [isVictory, setIsVictory] = useState(false);
    const [imageOpacity, setImageOpacity] = useState(1);
    const [word, setWord] = useState(null);
    const [bestTime, setBestTime] = useState(null);
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [audioTarget, setaudioTarget] = useState(null)
    const [images, setImages] = useState([])


    const audioLose = new Audio(soundNoMatch);
    const audioWin = new Audio(soundWin);


    useEffect(() => {
        const { selectedWord, imagesWords } = getWord();
        setaudioTarget(new Audio(selectedWord.audioSilaba));
        setWord(selectedWord);
        setImages(imagesWords);
        setIsRunning(true)
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

    const handleDrop = (item) => {
        if (!isVictory && item.correct) {
            setIsVictory(true);
            setImageOpacity(0);
            saveScore()
            let html = ``
            if (time < 5) {
                html = `<div>
                    <p style="font-size: 40px">⭐⭐⭐</p>
                    <p style="font-weight: bold; font-size: 20px">¡Felicidades! Ganaste en ${time} segundos.</p>
                </div>`
            } else if (time < 15) {
                html = `<div>
                    <p style="font-size: 40px">⭐⭐</p>
                    <p style="font-weight: bold; font-size: 20px">¡Felicidades! Ganaste en ${time} segundos.</p>
                </div>`
            } else {
                html = `<div>
                    <p style="font-size: 40px">⭐</p>
                    <p style="font-weight: bold; font-size: 20px">¡Felicidades! Ganaste en ${time} segundos.</p>
                </div>`
            }

            audioWin.play();
            Swal.fire({
                html: html,
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
        } else {
            audioLose.play();
            Swal.fire({
                text: "Perdiste !!!",
                icon: 'error',
                confirmButtonText: 'Jugar de Nuevo',
                cancelButtonText: 'Salir',
                showCancelButton: true
            }).then((result) => {
                saveScore();
                if (result.isConfirmed) {
                    window.location.reload();
                } else {
                    navigator("/")
                }
            })
        }
    };


    useEffect(() => {
        const getScore = async () => {
            const score = {
                token: user.token,
                game: "game2"
            }
            try {
                const response = await api.post('/getScore', score)
                if (response.status === 200) {
                    setBestTime(response.data.game.bestTime)
                }
            } catch (error) {
                console.error(error);
            }
        }
        getScore();
    }, [user]);

    const saveScore = async () => {
        const score = {
            bestTime: time,
            game: "game2",
            token: user.token
        }
        try {
            await api.post('/score', score)
        } catch (error) {
            console.log(error);
        }
    }

    const ImageContainer = ({ images }) => {
        return (
            <div>
                {images.map((image, index) => (
                    <Image
                        audio={new Audio(image.audioPalabra)}
                        className="imageDraw"
                        key={index}
                        src={image.src}
                        alt={image.alt}
                        opacity={imageOpacity}
                        correct={image.correct}
                    />
                ))}
            </div>
        );
    };

    const Image = ({ src, alt, audio, isDragging, opacity, correct, audioPalabra }) => {
        const [, ref] = useDrag({
            type: 'IMAGE',
            item: { src, alt, correct, audioPalabra },
        });

        const imageStyle = {
            cursor: 'pointer',
            width: '75px',
            height: '75px',
            opacity: isDragging ? 0.5 : opacity,
            margin: '30px'
        };

        return (
            <img
                ref={ref}
                src={src}
                alt={alt}
                onMouseEnter={() => {
                }}
                style={imageStyle}
            />
        );
    };




    const DropTarget = () => {
        const imgRef = useRef(null);
        const [, ref] = useDrop({
            accept: 'IMAGE',
            drop: (item) => handleDrop(item),
        });

        return (
            <div ref={ref}>
                {word && (
                    <img
                        className='mt-3'
                        width="100px"
                        height="100px"
                        style={{ opacity: 0.5 }}
                        ref={imgRef}
                        src={word.image}
                        alt="Imagen de Fondo"

                    />
                )}
            </div>
        );
    };



    return (
        <DndProvider backend={HTML5Backend}>
            <div className='center-game2'>
                <ImageContainer images={images} />
                {isVictory && <p>¡Has ganado el juego!</p>}
                <DropTarget />
                <h2>Separación de sílabas</h2>
                <div className="speaker-button">
                    <button onMouseEnter={() => audioTarget.play()} ><img src={altavoz} className="altavoz-btn" alt='altavoz' /></button>
                </div>
                <div className="title">
                    {word ? word.word : ''}
                </div>
                <h3>{word ? word.syllable_separation : ''}</h3>
                <div className='color'>Cronómetro: {time} segundos</div>
                <div className='color'>Mejor tiempo: {bestTime === null ? 'N/A' : `${bestTime} segundos`}</div>
            </div>
        </DndProvider>
    );
};

export default Game2;