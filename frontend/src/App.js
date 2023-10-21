import './App.css';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from 'react';

import { AuthContext } from './Context/AuthContext';
import Home from './Pages/Home';
import Register from './Pages/Register';
import ForgetPassword from './Pages/ForgetPassword';

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
      <Route index element={<Home />} />
      <Route path='/register' element={<Register />} />
      <Route path='/forgot-password' element={<ForgetPassword />} />


    </Routes>


  );
}

export default App;
