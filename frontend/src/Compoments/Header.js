import React, { useContext } from 'react';
import "./header.css";
import logo from "../assets/images/logo.png"
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Header() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const salir = async (e) => {
        e.preventDefault();
        await logout();
        Swal.fire({
            icon: 'success',
            iconHtml: '<img src="https://www.easy-gst.in/wp-content/uploads/2017/07/success-icon-10.png" alt="Icono personalizado" width="98">',
            title: "Se ha cerrado sesión correctamente!",
            showConfirmButton: true,
            confirmButtonText: 'OK',
        }).then((result) => {
            if (result.isConfirmed) {
                navigate("/");
            }
        });
    }

    return (
        <div className='fixed-top'>
            <nav className="navbar navbar-light custom-bg">
                <div className="container-fluid">
                    <a className="navbar-brand"><img className='img-fluid logo' src={logo} alt="Logo" /></a>
                    <form className="d-flex">
                        <button onClick={salir} className="btn btn-outline-success" type="button">Salir</button>
                    </form>
                </div>
            </nav>
        </div>
    )
}
