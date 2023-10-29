import React from 'react'
import "./Games.css"
import avatar from "../../Images/workoutLLogo.png"
import Header from '../../Compoments/Header';

export default function Games() {


    const elementos = [
        {
            nombre: "Juego 1",
            descripcion: "Arma un rompecabezas",
            imagen: avatar,
            game: "game1"
        },
        {
            nombre: "Elemento 2",
            descripcion: "Descripción del Elemento 2",
            imagen: avatar,
            game: "game2"
        },
        {
            nombre: "Elemento 3",
            descripcion: "Descripción del Elemento 3",
            imagen: avatar,
            game: "game3"
        },
        {
            nombre: "Elemento 4",
            descripcion: "Descripción del Elemento 4",
            imagen: "imagen4.jpg",
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
                    {elementos.map((elemento, index) => ( // Aquí corregido
                        <div key={index} className="col-sm-5 mt-2">
                            <div className="card">
                                <img src={elemento.imagen} alt={elemento.nombre} className='card-img-top img-fluid im-card' />
                                <div className="card-body">
                                    <h5 className="card-title title-card">{elemento.nombre}</h5>
                                    <p className="card-text">{elemento.descripcion}</p>
                                    <a href={`/games/${elemento.game}`}>  <button className="main-button">Jugar</button> </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


            </div>


        </>
    )
}
