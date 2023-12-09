import React, { useState } from "react";
import './login.css';
import Swal from 'sweetalert2'
import Form from 'react-bootstrap/Form';
// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import KeyIcon from '@mui/icons-material/Key';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import AccountCircle from '@mui/icons-material/AccountCircle';
import {
    IconButton,
    InputAdornment
} from '@mui/material';
import api from "../api/api"
import { useNavigate } from "react-router-dom";

export default function Register() {

    const navigator = useNavigate()


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const authSubmitHandler = async (e) => {
        e.preventDefault();


        const register = {
            email,
            password
        }

        try {

            const response = await api.post('/user/register', register)

            Swal.fire({
                icon: 'success',
                iconHtml: '<img src="https://www.easy-gst.in/wp-content/uploads/2017/07/success-icon-10.png" alt="Icono personalizado" width="98">',
                title: "Por favor inicia sesión!",
                showConfirmButton: true,
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigator("/");
                }
            });

        } catch (error) {

            console.log("error", error.response.data.message)

            Swal.fire({
                icon: 'error',
                iconHtml: '<img src="https://www.easy-gst.in/wp-content/uploads/2017/07/error-icon-10.png" alt="Icono personalizado" width="98">',
                title: error.response.data.message,
                showConfirmButton: true,
                confirmButtonText: 'OK',
            })

        }
    };


    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <div className='container-fluid-login background'>


            <div className='row justify-content-center'>

                <div className='col-sm'>



                    <h1 className='title mb-3'>Registrate</h1>

                    <div className="center">

                        <Form className="Auth-form">
                            <div className="Auth-form-content">
                                <h3 className="Auth-form-title">Coloca tu correo y una contraseña</h3>
                                <FormControl variant="standard" sx={{ m: 1, width: '100%' }}>
                                    <InputLabel className="label-auth" htmlFor="input-with-icon-adornment">
                                        Correo electrónico
                                    </InputLabel>
                                    <Input
                                        id="input-with-icon-adornment"
                                        type="email"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <AccountCircle />
                                            </InputAdornment>
                                        }
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </FormControl>

                                <FormControl sx={{ m: 1, width: '100%' }} variant="standard">
                                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                    <Input
                                        id="outlined-adornment-password"
                                        type={showPassword ? 'text' : 'password'}
                                        onChange={(e) => setPassword(e.target.value)}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <KeyIcon />
                                            </InputAdornment>
                                        }
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Password"
                                    />
                                </FormControl>

                                <div className="d-grid gap-2 mt-3">
                                    <button onClick={authSubmitHandler} className="main-button">
                                        Registrarse
                                    </button>
                                </div>
                                <p className="forgot-password text-right mt-2 "> <a href="/">Inicia Sesión</a></p>

                                <p className="forgot-password text-right mt-2">
                                    ¿Olvidaste tu <a href="/forgot-password" >contraseña?</a>
                                </p>
                            </div>
                        </Form >
                    </div>


                </div>

            </div>



        </div>
    );
}
