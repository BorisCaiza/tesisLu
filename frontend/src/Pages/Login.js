import React, { useContext, useState } from "react";
import './login.css';
import Swal from 'sweetalert2'
import Cookies from 'universal-cookie';
import Button from 'react-bootstrap/Button';
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
import avatar from "../Images/avataaars.svg"
import "./login.css"

function Login() {


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const authSubmitHandler = (e) => {
        e.preventDefault();
        // Aquí puedes agregar la lógica de autenticación si es necesario
    };


    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <div className='container-fluid-login  background'>


            <div className='row justify-content-center'>

                <div className='col-sm'>



                    <h1 className='title mb-3'>Bienvenidos</h1>

                    <div className="center">

                        <Form className="Auth-form">
                            <div className="Auth-form-content">
                                <h3 className="Auth-form-title">Ingresar</h3>
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
                                        Ingresar
                                    </button>
                                </div>
                                <p className="forgot-password text-right mt-2 "> <a href="/register">Registrate Aquí</a></p>

                                <p className="forgot-password text-right mt-2">
                                    ¿Olvidaste tu <a href="/forgot-password">contraseña?</a>
                                </p>
                            </div>
                        </Form >
                    </div>


                </div>

            </div>



        </div>
    );
}

export default Login;