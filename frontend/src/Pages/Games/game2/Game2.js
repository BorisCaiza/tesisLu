import React, { useState, useEffect, useContext } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate } from 'react-router-dom';
import './game2.css';
import altavoz from "../../../assets/altavoz.png"
import { wordsDataService } from '../../../services/datosServices';
import { AuthContext } from '../../../Context/AuthContext';
import api from "../../../api/api"
import Swal from 'sweetalert2';
import confetti from "canvas-confetti"


const Game2 = () => {

    const navigator = useNavigate();

    const { user } = useContext(AuthContext);
    const [isVictory, setIsVictory] = useState(false);
    const [imageOpacity, setImageOpacity] = useState(1); // Establece la opacidad inicial en 1 (sin transparencia)
    const [word, setWord] = useState(null);
    const [word2, setWord2] = useState(null);
    const [bestTime, setBestTime] = useState(null);
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(true);
    const [images, setImages] = useState([])


    useEffect(() => {
        getWord();
        getScore();

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
            setImageOpacity(0); // Establece la opacidad en 0 (completamente transparente)
            speak();
            saveScore()
            getScore()

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

    const getScore = async () => {

        const score = {
            token: user.token,
            game: "game2"
        }
        try {
            const response = await api.post('/getScore', score)
            if (response.status === 200) {
                console.log("tiempo", response.data.game.bestTime)
                setBestTime(response.data.game.bestTime)
            }
        } catch (error) {

        }

    }

    const saveScore = async () => {

        const score = {
            bestTime: time,
            game: "game2",
            token: user.token
        }

        try {

            const response = await api.post('/score', score)

            console.log("respone", response.data)

        } catch (error) {

        }
    }

    const ImageContainer = ({ images }) => {
        return (
            <div>
                {images.map((image, index) => (
                    <Image
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

    const Image = ({ src, alt, isDragging, opacity, correct }) => {
        const [, ref] = useDrag({
            type: 'IMAGE',
            item: { src, alt, correct },
        });

        const imageStyle = {
            width: '75px',
            height: '75px',
            opacity: isDragging ? 0.5 : opacity,
            cursor: 'pointer',
        };


        return (
            <img
                ref={ref}
                src={src}
                alt={alt}
                style={imageStyle}
            />
        );
    };

    const speak = () => {
        if (word) {
            const syllables = word.word.split('-'); // Divide la palabra en sílabas

            // Obtén la lista de voces disponibles
            const voices = window.speechSynthesis.getVoices();

            console.log("voices", voices)

            // Selecciona una voz específica (por ejemplo, la primera voz disponible)
            const femaleVoice = voices.find(voice => voice.voiceURI.includes('female'));

            // Crea una instancia de SpeechSynthesisUtterance y configúrala con la voz seleccionada
            syllables.forEach((syllable, index) => {
                const utterance = new SpeechSynthesisUtterance(syllable);
                utterance.lang = 'es-ES'; // Configura el idioma (puede variar según el idioma que desees)
                utterance.rate = 0.7; // Ajusta la velocidad de pronunciación según tu preferencia
                utterance.voice = femaleVoice;
                utterance.onend = () => {
                    if (index < syllables.length - 1) {
                        window.speechSynthesis.speak(syllables[index + 1]); // Reproduce la siguiente sílaba
                    }
                };
                window.speechSynthesis.speak(utterance); // Reproduce la primera sílaba
            });
        }
    };

    const getWord = () => {
        const words = wordsDataService();
        const randomIndex = Math.floor(Math.random() * words.length);
        const randomWord = words[randomIndex];
        setWord(randomWord);

        let randomIndex2;
        let randomWord2;

        do {
            randomIndex2 = Math.floor(Math.random() * words.length);
            randomWord2 = words[randomIndex2];
        } while (randomIndex2 === randomIndex);

        setWord2(randomWord2);

        const imagesAux = [
            { src: randomWord.image, alt: 'Imagen de Fondo', correct: true },
            { src: randomWord2.image, alt: 'Imagen Fondo2', correct: false }
        ];

        const shuffled = [...imagesAux];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setImages(shuffled);
    };



    const DropTarget = () => {
        const [, ref] = useDrop({
            accept: 'IMAGE',
            drop: (item) => handleDrop(item),
        });

        const backgroundImage = word ? `url('${word.image}')` : 'none';

        const borderStyle = {
            width: '100px',
            height: '100px',
            border: 'none',
            backgroundImage,
            backgroundSize: 'cover',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0.4,
            display: isVictory ? 'none' : 'block',
        };

        return (
            <div ref={ref} style={borderStyle}>
            </div>
        );
    };




    return (
        <DndProvider backend={HTML5Backend}>
            <div className='center-game2'>
                <ImageContainer images={images} />
                <DropTarget />
                {isVictory && <p>¡Has ganado el juego!</p>}
                <div className="title">
                    {word ? word.word : ''}
                </div>
                <div className="speaker-button">
                    <img src={altavoz} className="altavoz-btn" onClick={speak} alt='altavoz' />
                </div>
                <h2>Separación de sílabas</h2>
                <h5>{word ? word.syllable_separation : ''}</h5>

                <div className='color'>Cronómetro: {time} segundos</div>
                <div className='color'>Mejor tiempo: {bestTime === null ? 'N/A' : `${bestTime} segundos`}</div>
            </div>

        </DndProvider>
    );
};

export default Game2;
