import React from 'react'
import "./Games.css"
import avatar from "../../Images/workoutLLogo.png"
import juego1 from "../../assets/images/juego1.png"
import juego2 from "../../assets/images/juego2.png"
import juego3 from "../../assets/images/juego3.png"
import juego4 from "../../assets/images/juego4.png"
import Header from '../../Compoments/Header';

export default function Games() {
    const elementos = [
        {
            nombre: "Segmentación de sonidos",
            descripcion: "Arma un rompecabezas",
            imagen: juego1,
            game: "game1"
        },
        {
            nombre: "Conciencia de sílabas",
            descripcion: "Selecciona la silaba correcta",
            imagen: juego2,
            game: "game2"
        },
        {
            nombre: "Conciencia de rima",
            descripcion: "Encuentra la rima correcta",
            imagen: juego3,
            game: "game3"
        },
        {
            nombre: "Juego de Memoria ",
            descripcion: "Encuentra la pareja correcta",
            imagen: juego4,
            game: "game4"
        }
    ];


    return (

        <>



            <Header />
            <div className='container-fluid background-games up'>

                <div className='row justify-content-center'>

                    <div className='col-sm center-games'>

                        <div className='title-games'>
                            <h1>Escoge un juego</h1>
                        </div>
                    </div>

                </div>


                <div className='row justify-content-center mt-3'>
                    {elementos.map((elemento, index) => ( // Aquí corregidod
                        <div key={index} className="col-sm-5 mt-2">
                            <div className="card">
                                <img src={elemento.imagen} alt={elemento.nombre} style={{ height: "400px" }} className='card-img-top img-fluid im-card' />
                                <div className="card-body">
                                    <h5 className="card-title title-card">{elemento.nombre}</h5>
                                    <p className="card-text">{elemento.descripcion}</p>
                                    <a href={`/video/${elemento.game}`}>  <button className="main-button">Jugar</button> </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


            </div>


        </>
    )
}
