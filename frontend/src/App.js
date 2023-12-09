import './App.css';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from 'react';

import { AuthContext } from './Context/AuthContext';
import Login from './Pages/Login';
import Register from './Pages/Register';
import ForgetPassword from './Pages/ForgetPassword';
import Games from './Pages/Games/Games';
import LayoutGame from './Pages/Games/layoutGame/LayoutGame';
import Header from './Compoments/Header';
import VideoExplicacion from './Pages/Games/VideoExplicacion';
import NewPassword from "./Pages/NewPassword"

import 'bootstrap/dist/css/bootstrap.css';


function App() {


  const { user } = useContext(AuthContext);
  const navigate = useNavigate();


  return (
    <>


      {!user ? (
        <Routes>
          <Route index element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgetPassword />} />
          <Route path='/newPassword/:token' element={<NewPassword />} />
        </Routes>
      ) : (
        <>
          <Header />
          <Routes>
            <Route index element={<Games />} />
            <Route path='/video/:id' element={<VideoExplicacion />} />
            <Route path='/games/:id' element={<LayoutGame />} />
          </Routes>
        </>
      )}
    </>
  );
}

export default App;
