import React from 'react';
import './layoutGame.css'

const LayoutGame = () => {
    return (
        <div className="zoo-layout">
            {/* Fondo de ladrillos */}
            <div className="brick-wall">

            </div>

            {/* Componente central de 400x400px */}
            <div className="center-component"></div>

            {/* Botón de regreso */}
                <div className="back-button">
                    <button className="large-orange-button">Regresar</button>
                </div>
        </div>
    );
};

export default LayoutGame;
