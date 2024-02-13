const LocalModel = require("../model/Local.model");
const serviceModal = require("../model/Service.modal");
const mongoose = require('mongoose');


const serviceCtrl = {};

//obtener servicios

serviceCtrl.getServices = async (req, res) => {


    let services = await serviceModal.find()

    //console.log(suppliers)

    if (services.length > 0) {

        res.status(200).send({
            status: true,
            services: services
        })

    } else {
        res.status(400).send({
            status: false,
            message: "No exiten servicios"
        })
    }
}

//Obtener servicio

serviceCtrl.getService = async (req, res) => {

    let id = req.params.id

    if (!mongoose.Types.ObjectId.isValid(id)) {

        return res.status(400).send({
            status: false,
            message: "Id no valido"
        })

    }



    let service = await serviceModal.findById(id)

    if (!service) {

        res.status(400).send({
            status: false,
            message: "No existe el proveedor"
        })

    } else {

        try {

            res.status(200).send({
                status: true,
                service: service
            })

        } catch (error) {
            res.json({
                status: false,
                message: "Error al encontrar el servicio"
            });

        }




    }
}



//Crear servicio
serviceCtrl.create = async (req, res) => {


    let date = new Date();
    let strTime = date.toLocaleString("en-US", { timeZone: "America/Bogota" });
    const { name, duration, gender, type } = req.body;


    try {

        const service = new serviceModal({
            name: name,
            duration: duration,
            gender: gender,
            type: type
        })

        await service.save()

        res.status(200).send({
            status: true,
            message: "Servicio Creado"
        })

    } catch (error) {


        res.status(400).send({
            status: true,
            message: "Error al crear el servicio"
        })


    }









}

//Actualziar servicio


serviceCtrl.update = async (req, res) => {



    let id = req.params.id

    if (!mongoose.Types.ObjectId.isValid(id)) {

        return res.status(400).send({
            status: false,
            message: "Id no valido"
        })

    }



    const { name, duration, gender, type } = req.body

    let newLocal = {
        name: name,
        duration: duration,
        gender: gender,
        type: type
    }

    try {

        await serviceModal.findByIdAndUpdate(req.params.id, newLocal, { userFindAndModify: false });

        res.status(200).send({
            status: true,
            message: "Local actualizado"

        })

    } catch (error) {

        console.log("error", error)

        res.status(400).send({
            status: false,
            message: "Error al actualizar local"
        })

    }


}


//Eliminar servicio

serviceCtrl.delete = async (req, res) => {

    let id = req.params.id



    if (!mongoose.Types.ObjectId.isValid(id)) {

        return res.status(400).send({
            status: false,
            message: "Id no valido"
        })

    }


    let service = await serviceModal.findById(id)

    if (!service) {

        res.status(400).send({
            status: false,
            message: "No existe el proveedor"
        })

    } else {

        try {

            await serviceModal.findByIdAndDelete(id, { userFindAndModify: false });

            res.status(200).send({
                status: true,
                message: "Servicio Eliminado"
            })

        } catch (error) {

            res.json({
                status: false,
                message: "Error al eliminar el servicio"
            });

        }




    }
}


module.exports = serviceCtrl;
