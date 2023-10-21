import api from "../api/api";
import Swal from "sweetalert2";

const services = async () => {
    const data = await api.get('/services/');
    return data;

}

/*
const createCollection = async (image, name, description, userId) => {
    let formData = new FormData()
    formData.append('image', image)
    formData.append('name', name)
    formData.append('description', description)
    formData.append('creator', userId)
    const res = await api.post('/collections/create', formData)
    const msg = res.data.message
    if (res.data.status) {
        //Alerta de agregado
        Swal.fire({
            icon: 'success',
            iconHtml: '<img src="https://www.easy-gst.in/wp-content/uploads/2017/07/success-icon-10.png" alt="Icono personalizado" width="98">',
            title: msg,
            showConfirmButton: false,
            timer: 2000
        })
        //Para cerrar el modal
    } else {
        Swal.fire({
            icon: 'error',
            title: msg,
            showConfirmButton: false,
            timer: 2000
        })
    }
    return res;
}
//Funcion para eliminar una colección 
const deleteCollection = async (id) => {
    Swal.fire({
        title: '¿Estás seguro de eliminar la colección?',
        text: "¡No podrás revertirlo!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const res = await api.delete('/collections/delete/' + id).then((res) => {
                if (!res.data.status) {
                    //Alerta de eliminado
                    Swal.fire({
                        icon: 'success',
                        iconHtml: '<img src="https://www.easy-gst.in/wp-content/uploads/2017/07/success-icon-10.png" alt="Icono personalizado" width="98">',
                        title: res.data.message,
                        showConfirmButton: false,
                        timer: 2000
                    })
                }
            }).catch(async (err) => {
                console.log(err)
                if (err.response.status !== 500) {
                    Swal.fire({
                        icon: 'error',
                        title: err.response.data.message || "No se puede eliminar la colección",
                        showConfirmButton: true
                    })
                }
            })
            return res;
        }
    })
}


//Funcion para actualizar la colección
const updateCollection = async (id, image, name, description) => {
    let formData = new FormData()
    formData.append('image', image)
    formData.append('name', name)
    formData.append('description', description)
    const response = await api.put('/collections/update/' + id, formData).then((res) => {
        const msg = res.data.message
        if (res.data.status) {
            //Alerta de editado
            Swal.fire({
                icon: 'success',
                iconHtml: '<img src="https://www.easy-gst.in/wp-content/uploads/2017/07/success-icon-10.png" alt="Icono personalizado" width="98">',
                title: msg,
                showConfirmButton: false,
                timer: 2000
            })
        } else {
            //Alerta de editado
            Swal.fire({
                icon: 'error',
                title: msg,
                showConfirmButton: false,
                timer: 2000
            })
        }
    }).catch((err) => {
        Swal.fire({
            icon: 'error',
            title: err.response.data.message,
            showConfirmButton: false,
            timer: 2000
        })
    })
    return response;
}*/

export default services