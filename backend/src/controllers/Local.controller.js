const LocalModel = require("../model/Local.model");
const localModel = require("../model/Local.model");
const LocalBookingModel = require("../model/LocalBooking,model");
const mongoose = require('mongoose');
const { parseHora, formatHora, corregirHorasConDecimales } = require("../util/BookingUtil");


const localCtrl = {};

//obtener servicios

localCtrl.getLocals = async (req, res) => {


    let locals = await localModel.find()

    //console.log(suppliers)

    if (locals.length > 0) {

        res.status(200).send({
            status: true,
            locals: locals
        })

    } else {
        res.status(400).send({
            status: false,
            message: "No exiten servicios"
        })
    }
}

//Obtener servicio

localCtrl.getlocal = async (req, res) => {

    let id = req.params.id

    if (!mongoose.Types.ObjectId.isValid(id)) {

        return res.status(400).send({
            status: false,
            message: "Id no valido"
        })

    }



    let local = await localModel.findById(id)

    if (!local) {

        res.status(400).send({
            status: false,
            message: "No existe el proveedor"
        })

    } else {

        try {

            res.status(200).send({
                status: true,
                local: local
            })

        } catch (error) {
            res.json({
                status: false,
                message: "Error al encontrar el local"
            });

        }




    }
}

//Editar Local

localCtrl.editLocal = async (req, res) => {


    let id = req.params.id

    if (!mongoose.Types.ObjectId.isValid(id)) {

        return res.status(400).send({
            status: false,
            message: "Id no valido"
        })

    }



    const { local, ubication, schedules, employe } = req.body

    console.log("sasa", employe)

    let newLocal = {
        local,
        ubication,
        schedules,
        employees: employe
    }

    try {

        await localModel.findByIdAndUpdate(req.params.id, newLocal, { userFindAndModify: false });

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

localCtrl.createLocal = async (req, res) => {

    const { local, ubication, schedules, employees } = req.body

    let newLocal = LocalModel({
        local,
        ubication,
        schedules,
        employees
    })

    try {

        newLocal.save()

        res.status(200).send({
            status: true,
            message: "Local Creado"
        })

    } catch (error) {

        res.status(400).send({
            status: false,
            message: "Error al crear usuario"
        })
    }



}




/*

//Crear servicio
localCtrl.create = async (req, res) => {

    let date = new Date();
    let strTime = date.toLocaleString("en-US", { timeZone: "America/Bogota" });
    const { name, description, duration } = req.body;


    try {

        const service = new serviceModal({
            name: name,
            description: description,
            duration: duration
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


localCtrl.update = async (req, res) => {

}


//Eliminar servicio
*/


localCtrl.delete = async (req, res) => {

    let id = req.params.id



    if (!mongoose.Types.ObjectId.isValid(id)) {

        return res.status(400).send({
            status: false,
            message: "Id no valido"
        })

    }


    let local = await localModel.findById(id)

    if (!local) {

        res.status(400).send({
            status: false,
            message: "No existe el local"
        })

    } else {

        try {

            await localModel.findByIdAndDelete(id, { userFindAndModify: false });

            res.status(200).send({
                status: true,
                message: "Local Eliminado"
            })

        } catch (error) {

            res.json({
                status: false,
                message: "Error al eliminar el local"
            });

        }




    }
}

localCtrl.getScheduleById = async (req, res) => {
    try {
        const localId = req.params.id;
        const { fechaSeleccionada } = req.body;
        const horas = [];
        const intervalo = 0.1667;

        const fecha = new Date(fechaSeleccionada);

        const diaSeleccionado = new Date(fecha).toLocaleDateString('es-ES', {
            weekday: 'long',
            timeZone: 'America/Bogota'
        });

        const local = await LocalModel.findById(localId);

        if (!local) {
            return res.status(404).json({ error: 'Local no encontrado' });
        }

        const localBooking = await LocalBookingModel.find({
            local: local.local,
            date: fechaSeleccionada
        });

        const horariosDia = local.schedules.find((horario) => horario.day === diaSeleccionado);

        if (horariosDia) {
            const horaApertura = parseHora(horariosDia.opening);
            const horaCierre = parseHora(horariosDia.closing);

            let hora = horaApertura;

            while (hora < horaCierre) {
                const horaFormateada = formatHora(hora);
                horas.push(horaFormateada);
                hora += intervalo; // Avanza al siguiente intervalo
            }

            const horasCorregidas = corregirHorasConDecimales(horas);

            const horario = [];

            for (const horaCorregida of horasCorregidas) {
                const ocupada = localBooking.some((reserva) => reserva.hour === horaCorregida);

                if (ocupada) {
                    horario.push({ hora: horaCorregida, estado: "Ocupado" });
                } else {
                    horario.push({ hora: horaCorregida, estado: "Disponible" });
                }
            }

            return res.status(200).json({ horario });
        } else {
            return res.status(404).json({ error: 'Horarios no disponibles para el día seleccionado' });
        }
    } catch (error) {
        console.error('Error en getScheduleById:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

localCtrl.changeState = async (req, res) => {
    try {
        const { localId, date, hour, estado } = req.body;

        const local = await LocalModel.findById(localId);
        if (!local) {
            return res.status(400).json({ error: 'No existe local' });
        }

        // Verifica si ya existe una reserva para la misma hora en la misma fecha y local
        const existingBooking = await LocalBookingModel.findOne({ local: local.local, date, hour });

        if (existingBooking) {
            // Si la reserva existe y no está ocupada, elimínala
            if (estado === "Ocupado") {
                await LocalBookingModel.findByIdAndRemove(existingBooking._id);
                return res.status(200).json({ message: 'Estado Acutalizado' });
            }
            // Si la reserva está ocupada, puedes manejarlo de acuerdo a tus necesidades
            // En este ejemplo, se informa que la reserva está ocupada
            return res.status(400).json({ error: 'La reserva está ocupada' });
        } else {
            const newBooking = new LocalBookingModel({
                local: local.local,
                date,
                hour,
            });

            await newBooking.save();
            return res.status(201).json({ message: 'Reserva creada con éxito' });
        }
    } catch (error) {
        console.error('Error en changeState:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};



module.exports = localCtrl;
