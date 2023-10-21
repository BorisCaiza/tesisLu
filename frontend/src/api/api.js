import axios from 'axios';
import Swal from 'sweetalert2';

const instance = axios.create({
    baseURL: "http://localhost:3004/api/",
   // baseURL: "https://workout.virtusproject.online/api/"
});
instance.interceptors.request.use(
    (config) => {
        if (localStorage.getItem('user-token')) {
            config.headers["Authorization"] = 'Bearer ' + localStorage.getItem('user-token');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    function (response) {
        // Cualquier código de estado que esté dentro del rango de 2xx hace que esta función se active
        return response;
    },
    async function (error) {
        console.log(error)
        // Cualquier código de estado que esté fuera del rango de 2xx hace que esta función se active
        const originalConfig = error.config;
        if (error.code === "ERR_NETWORK") {
            // Aquí puedes redirigir a una página específica cuando se produce un error de red
            window.location.href = "/error-page";
            return Promise.reject(error);
        }


        if (error.response?.data === "Refresh token is not valid!") {
            localStorage.clear();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: '¡Estuviste inactivo por mucho tiempo!',
                confirmButtonColor: '#e33084',
                allowOutsideClick: false,
                showConfirmButton: true,
                iconHtml: '<img src="https://cdn.icon-icons.com/icons2/317/PNG/512/sign-error-icon_34362.png" width="125">',
            }).then(() => {
                window.location.href = "/auth/login";
            });
        } else {
            if (error.response?.status === 400) {
                if (error.response.data?.status === false) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        iconHtml: '<img src="https://cdn.icon-icons.com/icons2/317/PNG/512/sign-error-icon_34362.png" width="125">',
                        text: error.response.data?.message || 'Ha ocurrido un error',
                    });
                } else {
                    return Promise.reject(error.response.data); // Enviar response.data
                }
            }
        }
        originalConfig._retry = true;
        return Promise.reject(error);
    }
);

export default instance;
