import React, { useContext, useState } from "react";
import './home.css';
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

export default function ForgetPassword() {


    const [email, setEmail] = useState('');

    const authSubmitHandler = (e) => {
        e.preventDefault();
        // Aquí puedes agregar la lógica de autenticación si es necesario
    };




    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <div className='container-fluid background'>


            <div className='row justify-content-center'>

                <div className='col-sm'>



                    <h1 className='title mb-3'>Recupera tu contraseña</h1>

                    <div className="center">

                        <Form className="Auth-form">
                            <div className="Auth-form-content">
                                <h3 className="Auth-form-title">Coloca tu correo</h3>
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



                                <div className="d-grid gap-2 mt-3">
                                    <button onClick={authSubmitHandler} className="main-button">
                                        Recuperar
                                    </button>
                                </div>

                            </div>
                        </Form >
                    </div>


                </div>

            </div>



        </div>
    );

}

