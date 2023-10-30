import React, { useContext, useState, useEffect } from "react";
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
import api from "../api/api"
import { useParams, useNavigate } from "react-router-dom";

export default function NewPassword() {

    const navigator = useNavigate();



    let { token } = useParams();


    const [password, setPassword] = useState("");

    useEffect(() => {
        getToken()


    }, []);


    const getToken = async (event) => {



        const config = {
            headers: {
                reset: token
            }
        }

        await api.get('/user/checkToken', config).then(async (res) => {



            const status = res.data.status
            const message = res.data.message

            if (!status) {

                Swal.fire({
                    icon: 'error',
                    title: message,
                    showConfirmButton: false,
                    timer: 1500
                })

                navigator("/")


            }
        })
    }

    const sendEmailAhandler = async event => {

        event.preventDefault()




        const config = {
            headers: {
                reset: token
            }
        }

        const data = {
            newPassword: password
        }


        await api.put('/user/newPassword', data, config).then(async (res) => {

            const status = res.data.status
            const message = res.data.message

            if (status) {
                Swal.fire({
                    icon: 'success',
                    title: "Contraseña Cambiada, intenta iniciar sesión de nuevo",
                    showConfirmButton: true,
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location = `/`;
                    }
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: message,
                    timer: 1500

                })
            }

        })





    }








    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <div className='container-fluid-login background'>


            <div className='row justify-content-center'>

                <div className='col-sm'>



                    <h1 className='title mb-3'>Recupera tu contraseña</h1>

                    <div className="center">

                        <Form className="Auth-form">
                            <div className="Auth-form-content">
                                <h3 className="Auth-form-title">Coloca tu nueva contraseña</h3>
                                <FormControl variant="standard" sx={{ m: 1, width: '100%' }}>
                                    <InputLabel className="label-auth" htmlFor="input-with-icon-adornment">
                                        Contraseña
                                    </InputLabel>
                                    <Input
                                        id="input-with-icon-adornment"
                                        type="email"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <AccountCircle />
                                            </InputAdornment>
                                        }
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </FormControl>



                                <div className="d-grid gap-2 mt-3">
                                    <button onClick={sendEmailAhandler} className="main-button">
                                        Cambiar Contraseña
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

