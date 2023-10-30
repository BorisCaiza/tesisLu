import './App.css';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from 'react';

import { AuthContext } from './Context/AuthContext';
import Login from './Pages/Login';
import Register from './Pages/Register';
import ForgetPassword from './Pages/ForgetPassword';
import Games from './Pages/Games/Games';
import Game1 from './Pages/Games/game1/Game1';
import Game2 from './Pages/Games/game2/Game2';
import Game3 from './Pages/Games/game3/Game3';
import LayoutGame from './Pages/Games/layoutGame/LayoutGame';
import Header from './Compoments/Header';
import VideoExplicacion from './Pages/Games/VideoExplicacion';



function App() {


  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user]);

  return (
    <>
      <Routes>
        <Route index element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgetPassword />} />
        <Route path='/games' element={<Games />} />
        <Route path='/video/:id' element={<VideoExplicacion />} />
        <Route path='/games/:id' element={<LayoutGame />} />
      </Routes>
    </>


  );
}

export default App;
