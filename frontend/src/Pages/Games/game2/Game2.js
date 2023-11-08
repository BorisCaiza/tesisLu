import React, { useState, useEffect, useContext } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate } from 'react-router-dom';
import './game2.css';
import fondo from '../../../Images/manzana.png';
import altavoz from "../../../assets/altavoz.png"
import { wordsDataService } from '../../../services/datosServices';
import { AuthContext } from '../../../Context/AuthContext';
import api from "../../../api/api"
import Swal from 'sweetalert2';

const Game2 = () => {

    const navigator = useNavigate();

    const { user } = useContext(AuthContext);
    const [isVictory, setIsVictory] = useState(false);
    const [imageOpacity, setImageOpacity] = useState(1); // Establece la opacidad inicial en 1 (sin transparencia)
    const [word, setWord] = useState(null);
    const [bestTime, setBestTime] = useState(null);
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(true);

    useEffect(() => {
        getWord();
        getScore();
    }, []); // Agrega una coma después del primer argumento

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

    const handleDrop = () => {
        if (!isVictory) {
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
                        key={index}
                        src={image.src}
                        alt={image.alt}
                        opacity={imageOpacity}
                    />
                ))}
            </div>
        );
    };

    const Image = ({ src, alt, isDragging, opacity }) => {
        const [, ref] = useDrag({
            type: 'IMAGE',
            item: { src, alt },
        });

        const imageStyle = {
            width: '60px',
            height: '60px',
            opacity: isDragging ? 0.5 : opacity, // Controla la opacidad
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

            // Crea una instancia de SpeechSynthesisUtterance para cada sílaba y configúrala
            syllables.forEach((syllable, index) => {
                const utterance = new SpeechSynthesisUtterance(syllable);
                utterance.lang = 'es-ES'; // Configura el idioma (puede variar según el idioma que desees)
                utterance.rate = 0.7; // Ajusta la velocidad de pronunciación según tu preferencia
                utterance.onend = () => {
                    if (index < syllables.length - 1) {
                        window.speechSynthesis.speak(syllables[index + 1]); // Reproduce la siguiente sílaba
                    }
                };
                window.speechSynthesis.speak(utterance); // Reproduce la primera sílaba
            });
        }
    }

    const getWord = () => {
        const words = wordsDataService();
        const randomIndex = Math.floor(Math.random() * words.length);
        const randomWord = words[randomIndex];
        setWord(randomWord);
    }

    const DropTarget = () => {
        const [, ref] = useDrop({
            accept: 'IMAGE',
            drop: () => handleDrop(),
        });

        const backgroundImage = word ? `url('${word.image}')` : 'none';

        const borderStyle = {
            width: '60px', // Establece el ancho
            height: '60px', // Establece el alto
            border: 'none',
            backgroundImage,
            backgroundSize: 'cover',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0.4,
            display: isVictory ? 'none' : 'block', // Oculta el componente cuando se gana el juego
        };

        return (
            <div ref={ref} style={borderStyle}>
            </div>
        );
    };


    const images = word
        ? [{ src: word.image, alt: 'Imagen de Fondo' }]
        : [];

    return (
        <DndProvider backend={HTML5Backend}>
            <div className='center'>
                <div className='image-container'>

                    <ImageContainer images={images} />
                </div>

                <DropTarget />
                {isVictory && <p>¡Has ganado el juego!</p>}
                <div className="title mt-3">
                    {word ? word.word : ''}
                </div>
                <div className="speaker-button">
                    <img src={altavoz} className="altavoz-btn" onClick={speak} alt='altavoz' />

                </div>

                <h2>Separación de sílabas</h2>
                <h5>{word ? word.syllable_separation : ''}</h5>

            </div>

            <div className='color'>Cronómetro: {time} segundos</div>

            <div className='color'>Mejor tiempo: {bestTime === null ? 'N/A' : `${bestTime} segundos`}</div>


        </DndProvider>
    );
};

export default Game2;
