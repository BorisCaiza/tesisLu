import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Swal from 'sweetalert2';

const AuthContext = createContext();

const getUserFromStorage = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

const setUserToStorage = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
};



const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getUserFromStorage());
    const [error, setError] = useState('');
    const navigator = useNavigate();

    const getUser = async () => {

        await api.get('/user/' + user.id).then(res => {
            if (res.status === 200) {
                return res.data.user;
            }
        }).catch(error => {
            console.log(error);
        })
    }

    const refreshToken = async () => {
        try {
            const response = await api.post('/user/token', {
                token: localStorage.getItem('refreshToken'),
            });
            localStorage.removeItem("user-token");
            localStorage.removeItem("refreshToken");

            const { token, refreshToken } = response.data;

            localStorage.setItem('user-token', token);
            localStorage.setItem("refreshToken", refreshToken)

            const userNew = await getUser();

            setUser({
                ...user,
                permisos: user.permisos,
                token: token,
                refreshToken: refreshToken,
            });

            setUserToStorage({
                ...user,
                token: token,
                permisos: userNew?.permisos,
                refreshToken: refreshToken,
            });
        } catch (error) {
            if (error.response && error.response.status === 403) {
                logout();
            }
            console.log(error);
        }
    };


    /*

    useEffect(() => {
        if (user && user.refreshToken) {
            const refreshTokenInterval = setInterval(refreshToken, 3 * 60 * 1000); // Actualizar el token cada 15 minutos
            return () => {
                clearInterval(refreshTokenInterval);
            };
        }
    }, [user]);*/

    useEffect(() => {
        setUserToStorage(user);
    }, [user]);

    const login = async (values) => {
        try {
            const response = await api.post('/user/login', values);

            if (response.status === 200) {
                setUser(response.data);
                setUserToStorage(response.data);
                localStorage.setItem('user-token', response.data.token);
                localStorage.setItem("refreshToken", response.data.refreshToken)
                localStorage.setItem("role", response.data.role)
                Swal.fire({
                    icon: 'success',
                    iconHtml: '<img src="https://www.easy-gst.in/wp-content/uploads/2017/07/success-icon-10.png" alt="Icono personalizado" width="98">',
                    title: "Bienvenido!!!",
                    showConfirmButton: false,
                    timer: 1500
                })

                navigator("/")
            } else {

            }
        } catch (error) {
            console.log("error", error)
            if (error.response && error.response.data && error.response.data.message) {
                Swal.fire({
                    icon: 'error',
                    iconHtml: '<img src="https://cdn.icon-icons.com/icons2/317/PNG/512/sign-error-icon_34362.png" width="125">',
                    title: "Credenciales Invalidas!!",
                    showConfirmButton: false,
                    timer: 1500
                })


                setError(error.response.data.message);
            } else {
                Swal.fire({
                    icon: 'error',
                    iconHtml: '<img src="https://cdn.icon-icons.com/icons2/317/PNG/512/sign-error-icon_34362.png" width="125">',
                    title: "Credenciales Invalidas!!",
                    showConfirmButton: false,
                    timer: 1500
                })
                setError('Ocurrió un error al iniciar sesión.');
            }
        }
    };

    const logout = async () => {
        try {
            const res = await api.post('/user/logout', { token: user.token });
            console.log(res);
        } catch (error) {
            console.log(error);
        }
        localStorage.removeItem("user");
        localStorage.removeItem("user-token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                error,
                login,
                logout,
                getUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
