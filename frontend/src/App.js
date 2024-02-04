import './App.css';
import { BrowserRouter, Routes, Route, useNavigate, Navigate, Outlet } from "react-router-dom";
import React, { lazy, useContext, useEffect, useState } from 'react';

import { AuthContext } from './Context/AuthContext';


import 'bootstrap/dist/css/bootstrap.css';
import 'video-react/dist/video-react.css';
import { Suspense } from 'react';

const LazyLogin = lazy(() => import('./Pages/Login'));
const LazyRegister = lazy(() => import('./Pages/Register'));
const LazyForgetPassword = lazy(() => import('./Pages/ForgetPassword'));
const LazyGames = lazy(() => import('./Pages/Games/Games'));
const LazyLayoutGame = lazy(() => import('./Pages/Games/layoutGame/LayoutGame'));
const LazyHeader = lazy(() => import('./Compoments/Header'));
const LazyVideoExplicacion = lazy(() => import('./Pages/Games/VideoExplicacion'));
const LazyNewPassword = lazy(() => import('./Pages/NewPassword'));
const LazyFooter = lazy(() => import('./Compoments/Footer'));



function App() {


  const { user } = useContext(AuthContext);


  return (
    <>


      {!user ? (

        <Routes>
          <Route path='/' element={<Layout />} >
            <Route index element={<LazyLogin />} />
            <Route path='/register' element={<LazyRegister />} />
            <Route path='/forgot-password' element={<LazyForgetPassword />} />
            <Route path='/newPassword/:token' element={<LazyNewPassword />} />
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Route>
        </Routes>
      ) : (
        <Routes>
          <Route path='/' element={<Layout >     <LazyHeader /></Layout>} >
            <Route index element={<LazyGames />} />
            <Route path='/video/:id' element={<LazyVideoExplicacion />} />
            <Route path='/games/:id' element={<LazyLayoutGame />} />
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Route>
        </Routes>
      )}
    </>
  );
}


const Layout = ({ children }) => (
  <>
    <Suspense fallback={<div>Loading...</div>}>
      {children}
      <Outlet/>
      <LazyFooter />
    </Suspense>
  </>
);


export default App;
