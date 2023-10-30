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
import NewPassword from './Pages/NewPassword';

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
        {!user && <Route index element={<Login />} />}
        {!user && <Route path='/register' element={<Register />} />}
        {!user && <Route path='/forgot-password' element={<ForgetPassword />} />}
        {user && <Route index element={<Games />} />}
        {user && <Route path='/games/game1' element={<Game1 />} />}
        {user && <Route path='/games/game2' element={<Game2 />} />}
        {user && <Route path='/games/game3' element={<Game3 />} />}
        {user && <Route path='/games/game' element={<LayoutGame />} />}
        {!user && <Route path="/newPassword/:token" element={<NewPassword />} />}
        <Route path="*" element={<h1>No hay la página</h1>} />


      </Routes>
    </>


  );
}

export default App;
