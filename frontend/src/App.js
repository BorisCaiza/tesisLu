import './App.css';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from 'react';

import { AuthContext } from './Context/AuthContext';
import Login from './Pages/Login';
import Register from './Pages/Register';
import ForgetPassword from './Pages/ForgetPassword';
import Games from './Pages/Games/Games';

function App() {


  const { user } = useContext(AuthContext);
  //const navigate = useNavigate();

  /*useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user]);*/


  return (

    <Routes>
      <Route index element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/forgot-password' element={<ForgetPassword />} />
      <Route path='/games' element={<Games />} />


    </Routes>


  );
}

export default App;
