const bookingModal = require("../model/Booking.model");
const mongoose = require('mongoose');
const nodemailer = require('nodemailer')
const JWT = require("jsonwebtoken");
const LocalModel = require("../model/Local.model");
const ServiceModal = require("../model/Service.modal");
const { obtenerHoraEmpleado } = require("../util/BookingUtil");
const contactModal = require("../model/Contact.model")


const bookingCtrl = {};

//obtener servicios

bookingCtrl.getBookings = async (req, res) => {


    let bookings = await bookingModal.find()

    //console.log(suppliers)

    if (bookings.length > 0) {

        res.status(200).send({
            status: true,
            bookings: bookings
        })

    } else {
        res.status(400).send({
            status: false,
            message: "No exiten servicios"
        })
    }
}

//Obtener servicio

bookingCtrl.getBooking = async (req, res) => {

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

bookingCtrl.getBookingByLocalAndDate = async (req, res) => {

    let id = req.params.id

    let { date } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {

        return res.status(400).send({
            status: false,
            message: "Id no valido"
        })

    }


    let booking = await bookingModal.find({ "local._id": id, date: date })

    //console.log(suppliers)

    if (booking) {

        res.status(200).send({
            status: true,
            booking: booking
        })

    } else {
        res.status(400).send({
            status: false,
            message: "No exiten agendas"
        })
    }
}


bookingCtrl.generateHorasDisponibles = async (req, res) => {

    const { fechaSeleccionada, id, duration } = req.body


    const horas = [];
    let horasNoRepetidas = []


    const intervalo = 0.5; // 10 minutos en horas
    //console.log("fecahSeleccionado", fechaSeleccionada)
    //console.log("local_id", id)
    const fecha = new Date(fechaSeleccionada)
    fecha.setDate(fecha.getDate() + 1)
    const diaSeleccionado = new Date(fecha).toLocaleDateString('en-US', { weekday: 'long', timeZone: "America/Bogota" });



    const local = await LocalModel.findById(id)


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


        const bookingSameDate = await bookingModal.find({ date: fechaSeleccionada, "local._id": local._id }).select('hour');


        const horaCount = {};

        bookingSameDate.forEach(booking => {
            const hora = booking.hour;

            if (horaCount[hora]) {
                horaCount[hora]++;
            } else {
                horaCount[hora] = 1;
            }
        });


        const horasRepetidas = Object.keys(horaCount).filter(hora => horaCount[hora] >= 2);

        horasNoRepetidas = horas.filter(hora => !horasRepetidas.includes(hora));


    }

    //const fechasFormateadas = horasNoRepetidas.map(formatFecha);

    return res.status(200).send({
        status: true,
        horasNoRepetidas: horasNoRepetidas
    });
}





function corregirHorasConDecimales(horas) {
    const horasCorregidas = horas.map(hora => {
        const [horaMinuto, decimal] = hora.split('.');
        const [hora2, minutos] = horaMinuto.split(':');
        return `${hora2}:${minutos.padStart(2, '0')}`;
    });
    return horasCorregidas;
}



bookingCtrl.generateHorasDisponibles2 = async (req, res) => {




    const { fechaSeleccionada, id, duration } = req.body




    const horas = [];
    let horasNoRepetidas = []



    const intervalo = 0.1667;

    const fecha = new Date(fechaSeleccionada)
    fecha.setDate(fecha.getDate() + 1)
    const diaSeleccionado = new Date(fecha).toLocaleDateString('en-US', { weekday: 'long', timeZone: "America/Bogota" });





    const local = await LocalModel.findById(id)


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



        const horasGood = (corregirHorasConDecimales(horas))




        const bookingSameDate = await bookingModal.find({ date: fechaSeleccionada, "local._id": local._id }).select('hour duration hour_end');



        const horariosOcupados = {};
        const horariosRepetidos = {};



        bookingSameDate.forEach(cita => {
            const horaInicio = cita.hour;
            const horaFinal = cita.hour_end;
            const partesHoraInicio = horaInicio.split(':');
            const partesHoraFinal = horaFinal.split(':');
            const horaInicioMinutos = parseInt(partesHoraInicio[0], 10) * 60 + parseInt(partesHoraInicio[1], 10);
            const horaFinalMinutos = parseInt(partesHoraFinal[0], 10) * 60 + parseInt(partesHoraFinal[1], 10);

            // Marcar los horarios ocupados en incrementos de 10 minutos
            for (let minutos = horaInicioMinutos; minutos < horaFinalMinutos; minutos += 10) {
                let hora = Math.floor(minutos / 60);
                const min = minutos % 60;

                // Formatear la hora en formato de 24 horas (agregando ceros si es necesario)
                const horaFormateada = `${hora.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;

                if (horariosOcupados[horaFormateada]) {
                    if (horariosRepetidos[horaFormateada]) {
                        horariosRepetidos[horaFormateada]++;
                    } else {
                        horariosRepetidos[horaFormateada] = 2; // Marcar el segundo como repetido
                    }
                } else {
                    horariosOcupados[horaFormateada] = true;
                }
            }
        });

        // Marcar como true los horarios que se repiten exactamente 2 veces
        for (const hora in horariosRepetidos) {
            if (horariosRepetidos[hora] === 2) {
                horariosOcupados[hora] = true;
            }
        }

        console.log("horarios repetidos", horariosRepetidos)




        const horasRepetidas = [];
        const horasContadas = {};

        bookingSameDate.forEach(cita => {
            const { hour } = cita;
            if (!horasContadas[hour]) {
                horasContadas[hour] = 1;
            } else {
                horasContadas[hour]++;
                if (horasContadas[hour] === 2) {
                    // Agregar el valor de "hour" a la lista de horas repetidas solo cuando se repite 2 veces
                    horasRepetidas.push(hour);
                }
            }
        });







        const horasRepetidasPorCitaAgendad = Object.keys(horariosRepetidos);


        //horasNoRepetidas = horasGood.filter(hora => !horasRepetidas.includes(hora));

        let horasGood2 = horasGood.filter(hora => !horasRepetidasPorCitaAgendad.includes(hora))



        const fechaHoy = new Date();

        const year = fechaHoy.getFullYear();
        const month = String(fechaHoy.getMonth() + 1).padStart(2, '0'); // +1 porque enero es 0
        const day = String(fechaHoy.getDate()).padStart(2, '0');

        // Crea una cadena de texto con el formato "YYYY-MM-DD" (año-mes-día)
        const fechaActualFormateada = `${year}-${month}-${day}`;


        const horaActual = new Date().toLocaleTimeString('en-US', { hour12: false });

        let horasDisponiblesDesdeAhora;

        if (fechaSeleccionada === fechaActualFormateada) {

            horasDisponiblesDesdeAhora = horasGood2.filter(hora => hora > horaActual);



        } else {

            horasDisponiblesDesdeAhora = horasGood2


        }





        let horasFinales = encontrarHorasInicioCita(duration, horasDisponiblesDesdeAhora, horasRepetidasPorCitaAgendad)



        return res.status(200).send({
            status: true,
            horasNoRepetidas: horasFinales
        });







    }






}




bookingCtrl.generateHorasDisponibles3 = async (req, res) => {
    const { fechaSeleccionada, id, duration } = req.body
    const horas = [];
    const intervalo = 0.1667;
    const fecha = new Date(fechaSeleccionada)
    fecha.setDate(fecha.getDate() + 1)
    const diaSeleccionado = new Date(fecha).toLocaleDateString('es-ES', { weekday: 'long', timeZone: "America/Bogota" });

    const local = await LocalModel.findById(id)

    const employes = local.employees

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

        const horasGood = (corregirHorasConDecimales(horas))

        // Crear un objeto para almacenar los horarios disponibles por empleado
        const horariosDisponiblesPorEmpleado = {};

        // Inicializar el objeto con todos los horariosGood
        for (let empleado = 1; empleado <= employes; empleado++) {
            horariosDisponiblesPorEmpleado[empleado] = [...horasGood];
        }

        //console.log("hoirarios disponibles", horariosDisponiblesPorEmpleado)

        const bookingSameDate = await bookingModal.find({ date: fechaSeleccionada, "local._id": local._id }).select('hour duration hour_end employe');



        obtenerHoraEmpleado(bookingSameDate, employes, horasGood, duration)
        const empleadoHorasOcupadas = obtenerHorasOcupadasPorEmpleado(bookingSameDate, employes);



        // Iterar sobre las citas existentes y eliminar las horas ocupadas para cada empleado
        bookingSameDate.forEach(cita => {
            const empleado = cita.employe;
            const horaInicio = cita.hour;
            const duracionCita = cita.duration;

            // Calcular la hora de finalización de la cita redondeada al múltiplo de 10 más cercano
            const horaInicioMinutos = horaAMinutos(horaInicio);
            const horaFinMinutos = Math.ceil((horaInicioMinutos + duracionCita) / 10) * 10;
            const horaFin = minutosAHora(horaFinMinutos);

            // Eliminar las horas ocupadas para el empleado en cuestión
            const horasOcupadas = horariosDisponiblesPorEmpleado[empleado];

            // Encontrar las horas ocupadas dentro del rango de la cita
            const horasOcupadasEnCita = horasOcupadas.filter(hora => {
                const horaMinutos = horaAMinutos(hora);
                return horaMinutos >= horaInicioMinutos && horaMinutos < horaFinMinutos;
            });

            // Eliminar las horas ocupadas encontradas
            horasOcupadasEnCita.forEach(hora => {
                const index = horasOcupadas.indexOf(hora);
                if (index !== -1) {
                    horasOcupadas.splice(index, 1);
                }
            });
        });

        // Ahora tienes un objeto horariosDisponiblesPorEmpleado con los horarios disponibles actualizados para cada empleado
        //console.log(horariosDisponiblesPorEmpleado);


        // Crear el array en el formato deseado
        const horariosDisponiblesArray = horasGood.reduce((result, hora) => {
            const empleadosDisponibles = [];
            for (let empleado = 1; empleado <= employes; empleado++) {
                if (horariosDisponiblesPorEmpleado[empleado].includes(hora)) {
                    empleadosDisponibles.push(empleado);
                }
            }

            // Solo agrega la hora al resultado si hay empleados disponibles
            if (empleadosDisponibles.length > 0) {
                result.push([hora, empleadosDisponibles.join(',')]);
            }

            return result;
        }, []);


        //Horas Inicio Citas
        const horariosInicioCitasPorEmpleado = {};

        // Inicializar el objeto con un array vacío para cada empleado
        for (let empleado = 1; empleado <= employes; empleado++) {
            horariosInicioCitasPorEmpleado[empleado] = [];
        }

        // Iterar sobre las citas existentes y agregar los horarios de inicio de las citas
        bookingSameDate.forEach(cita => {
            const empleado = cita.employe;
            const horaInicio = cita.hour;

            // Agregar el horario de inicio al empleado correspondiente
            horariosInicioCitasPorEmpleado[empleado].push(horaInicio);
        });

        // Ahora tienes un objeto horariosInicioCitasPorEmpleado con los horarios de inicio de citas para cada empleado
        //console.log("horas inicio cita", horariosInicioCitasPorEmpleado);


        // Crear un objeto para almacenar los horarios de inicio de citas no disponibles por empleado
        const horariosInicioCitasNoDisponiblesPorEmpleado = {};

        // Inicializar el objeto con un array vacío para cada empleado
        for (let empleado = 1; empleado <= employes; empleado++) {
            horariosInicioCitasNoDisponiblesPorEmpleado[empleado] = [];
        }

        //console.log("booking same data", bookingSameDate)

        // Iterar sobre las citas existentes y agregar los horarios de inicio de las citas no disponibles
        bookingSameDate.forEach(cita => {
            const empleado = cita.employe;
            const horaInicio = cita.hour;

            // Agregar el horario de inicio al empleado correspondiente
            horariosInicioCitasNoDisponiblesPorEmpleado[empleado].push(horaInicio);
        });

        // Ahora tienes un objeto horariosInicioCitasNoDisponiblesPorEmpleado con los horarios de inicio de citas no disponibles para cada empleado
        //console.log("horarios citas no disponibles", horariosInicioCitasNoDisponiblesPorEmpleado);

        // console.log("duracion", duration)
        //console.log("duracion", horariosDisponiblesPorEmpleado)
        //  console.log("duracion", empleadoHorasOcupadas)

        let finales = calcularHorariosDisponibles(duration, horariosDisponiblesPorEmpleado, empleadoHorasOcupadas)

        // console.log("finales", finales)
        return res.status(200).send({
            status: true,
            horas: finales

        });



    } else {
        return res.status(400).send({
            status: false,
            error: "No es econtro"

        });
    }

}

function ordenarYFiltrarHorarios(citasPorEmpleado) {
    // Iterar sobre las citas de cada empleado
    for (const empleado in citasPorEmpleado) {
        if (citasPorEmpleado.hasOwnProperty(empleado)) {
            const citas = citasPorEmpleado[empleado];

            // Ordenar las citas de mayor a menor
            citas.sort((a, b) => {
                return new Date(`2000-01-01T${b}:00`) - new Date(`2000-01-01T${a}:00`);
            });

            const citasFiltradas = [];

            for (let i = 0; i < citas.length; i++) {
                const horaInicio = new Date(`2000-01-01T${citas[i]}:00`);
                let sigueSecuencia = true;

                // Verificar si la siguiente cita está en la secuencia de 10 minutos
                if (i < citas.length - 1) {
                    const siguienteHora = new Date(`2000-01-01T${citas[i + 1]}:00`);
                    if (siguienteHora - horaInicio !== 10 * 60000) {
                        sigueSecuencia = false;
                    }
                }

                if (!sigueSecuencia) {
                    citas.splice(i, 1);
                    i--; // Ajustar el índice para volver a verificar este elemento
                }
            }

            citasPorEmpleado[empleado] = citas;
        }
    }

    return citasPorEmpleado;
}

function obtenerHorasOcupadasPorEmpleado(bookingSameData, employees) {
    const horasOcupadasPorEmpleados = {};

    for (var i = 1; i <= employees; i++) {
        if (!horasOcupadasPorEmpleados[i]) {
            horasOcupadasPorEmpleados[i] = [];
        }
    }





    bookingSameData.forEach(cita => {
        const empleado = cita.employe;
        let horaInicio = cita.hour;
        const duracionCita = cita.duration;
        const horaFin = sumarMinutos3(horaInicio, duracionCita);


        // Agregar todas las horas ocupadas por la cita
        while (horaInicio < horaFin) {
            horasOcupadasPorEmpleados[empleado].push(horaInicio);
            horaInicio = sumarMinutos2(horaInicio, 10); // Avanzar en incrementos de 10 minutos
        }
    });

    // Añadir un arreglo vacío para empleados sin citas
    const empleadosConCitas = Object.keys(horasOcupadasPorEmpleados);
    empleadosConCitas.forEach(empleado => {
        if (!horasOcupadasPorEmpleados[empleado].length) {
            horasOcupadasPorEmpleados[empleado] = [];
        }
    });

    return horasOcupadasPorEmpleados;
}


// Luego, puedes obtener las horas ocupadas por un empleado específico
function sumarMinutos3(hora, minutos) {
    const [horas, minutosActuales] = hora.split(':').map(Number);
    const totalMinutos = horas * 60 + minutosActuales + minutos;
    const nuevaHora = Math.floor(totalMinutos / 60);
    const nuevosMinutos = totalMinutos % 60;

    // Formatear la nueva hora y minutos como cadena en el formato HH:MM
    const nuevaHoraStr = String(nuevaHora).padStart(2, '0');
    const nuevosMinutosStr = String(nuevosMinutos).padStart(2, '0');

    return `${nuevaHoraStr}:${nuevosMinutosStr}`;
}


function calcularHorariosDisponibles(duracionCita, horariosDisponibles, horariosNoDisponibles) {
    // Redondear la duración de la cita al múltiplo de 10 más cercano
    const duracionRedondeada = Math.round(duracionCita / 10) * 10 + (duracionCita % 10 === 1 ? 10 : 0);

    console.log("duracion", duracionRedondeada)
    const horariosDisponiblesFiltrados = {};

    for (const empleado in horariosDisponibles) {
        if (horariosDisponibles.hasOwnProperty(empleado)) {
            const horariosEmpleado = horariosDisponibles[empleado];
            const horariosNoDisponiblesEmpleado = horariosNoDisponibles[empleado];

            // Filtrar los horarios disponibles según los no disponibles
            const horariosDisponiblesEmpleado = horariosEmpleado.filter(horario => {
                const horaInicio = new Date(`2000-01-01T${horario}:00`);
                const horaFin = new Date(horaInicio.getTime() + duracionRedondeada * 60000);

                // Verificar si el horario de inicio y el de finalización no están en los no disponibles
                return !horariosNoDisponiblesEmpleado.includes(horario) && !horariosNoDisponiblesEmpleado.includes(horaFin.getHours() + ':' + horaFin.getMinutes());
            });

            // Almacena los horarios disponibles filtrados en un nuevo objeto
            horariosDisponiblesFiltrados[empleado] = horariosDisponiblesEmpleado;
        }
    }

    return horariosDisponiblesFiltrados;
}



// Ejemplo de uso









function sumarMinutos2(hora, minutos) {
    const [horaStr, minutoStr] = hora.split(':');
    const horaInt = parseInt(horaStr);
    const minutoInt = parseInt(minutoStr);

    const nuevaHora = horaInt + Math.floor((minutoInt + minutos) / 60);
    const nuevoMinuto = (minutoInt + minutos) % 60;

    return `${nuevaHora.toString().padStart(2, '0')}:${nuevoMinuto.toString().padStart(2, '0')}`;
}




function encontrarHorasInicioCita(duracion, horariosDisponibles, horariosNoDisponibles) {
    // Crear un conjunto para los horarios no disponibles
    const horariosNoDisponiblesSet = new Set(horariosNoDisponibles);

    // Redondear la duración al múltiplo de 10 más cercano
    const duracionRedondeada = Math.ceil(duracion / 10) * 10;

    //console.log("duracion", duracionRedondeada)

    // Crear un conjunto para los horarios disponibles de inicio
    const horasInicioDisponibles = [];

    // Recorrer los horarios disponibles
    for (const horaInicio of horariosDisponibles) {
        // Verificar si la hora de inicio y su duración están disponibles
        let horaActual = horaInicio;
        let disponible = true;

        for (let i = 0; i < duracionRedondeada / 10; i++) {
            if (horariosNoDisponiblesSet.has(horaActual)) {
                disponible = false;
                break;
            }
            horaActual = sumarMinutos(horaActual, 10);
        }

        if (disponible) {
            horasInicioDisponibles.push(horaInicio);
        }
    }

    return horasInicioDisponibles;
}

// Función para sumar minutos a una hora en formato HH:mm
function sumarMinutos(hora, minutos) {
    const [hh, mm] = hora.split(":");
    const horaFecha = new Date(0, 0, 0, hh, mm);
    horaFecha.setMinutes(horaFecha.getMinutes() + minutos);
    const hhNueva = horaFecha.getHours().toString().padStart(2, '0');
    const mmNueva = horaFecha.getMinutes().toString().padStart(2, '0');
    return `${hhNueva}:${mmNueva}`;
}









function minutosAHora(minutos) {
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    const amPm = horas < 12 ? 'AM' : 'PM';
    const horaFormateada = `${horas % 12}:${minutosRestantes < 10 ? '0' : ''}${minutosRestantes} ${amPm}`;
    return horaFormateada;
}

function horaAMinutos(hora) {
    const partes = hora.split(' ');
    const tiempo = partes[0].split(':');
    const horas = parseInt(tiempo[0]);
    const minutos = parseInt(tiempo[1]);
    const amPm = partes[1];

    let minutosTotales = horas * 60 + minutos;

    if (amPm === 'PM') {
        minutosTotales += 12 * 60;
    }

    return minutosTotales;
}





function limpiarHoras(horasArray) {
    const horasLimpias = [];

    horasArray.forEach(hora => {
        const partesHora = hora.split(":");
        const horaCompleta = partesHora[0];
        const minutos = partesHora[1].split(".")[0];
        const amPm = partesHora[1].split(" ")[1];

        const horaLimpia = `${horaCompleta}:${minutos} ${amPm}`;
        horasLimpias.push(horaLimpia);
    });

    return horasLimpias;
}









bookingCtrl.getBookingByToken = async (req, res) => {


    const { token } = req.body

    if (!token) {
        res.status(400).send({
            status: false,
            message: "No existe el token"
        })
    }

    const booking = await bookingModal.findOne({ token: token })

    if (booking === undefined || booking === null) {

        return res.status(400).send({
            status: false,
            message: "No existe la agenda"
        })
    }




    let services = []


    for (let index = 0; index < booking.services.length; index++) {

        const serviceFounded = await ServiceModal.findOne({ name: booking.services[index], gender: booking.client.gender })

        if (serviceFounded) {
            services.push(serviceFounded)
        }

    }


    if (!booking) {
        res.status(400).send({
            status: false,
            message: "No existe la agenda"
        })
    } else {
        res.status(200).send({
            status: true,
            booking: booking,
            services: services
        })
    }
}


bookingCtrl.editBooking = async (req, res) => {





    let id = req.params.id



    const { local_id, fecha, hora, horaFinal } = req.body;


    let local;




    if (!mongoose.Types.ObjectId.isValid(id)) {


        return res.status(400).send({
            status: false,
            message: "Id no valido"
        })

    }


    let booking = await bookingModal.findById(id)

    if (!booking) {

        res.status(400).send({
            status: false,
            message: "No existe la agenda"
        })
    }

    try {




        local = await LocalModel.findById(local_id)

        if (!local) {
            res.status(400).send({
                status: false,
                message: "Local no encontrado"
            })
        }
    } catch (error) {

        console.log(error)

        res.status(400).send({
            status: false,
            message: "Error"
        })

    }



    const token = JWT.sign({
        email: booking.client.email,
        number: booking.client.number,
        fecha: booking.date,
        hour: booking.hour
    }, "RESET", { expiresIn: "168h" })


    await bookingModal.updateOne({ _id: booking._id }, { $unset: { token: 1 } })



    const modifyLink = `${process.env.URL_FRONTEND}/modify/${token}`

    const deleteLink = `${process.env.URL_FRONTEND}/delete/${token}`

    const bookingNew = {


        local: {
            _id: local._id,
            name: local.local
        },

        date: fecha,
        hour: hora,
        hour_end: horaFinal,
        token: token
    }




    try {

        await bookingModal.findByIdAndUpdate(req.params.id, bookingNew, { userFindAndModify: false });

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL, // generated ethereal user
                pass: process.env.TOKEN_EMAIL, // generated ethereal password
            },
        });

        var arrayItems = '';


        console.log("servicios", booking.services)

        let services = booking.services

        if (services.length > 0) {

            for (var i = 0; i < services.length; i++) {
                arrayItems += "<li>" + services[i] + " </li>";

            }

            // console.log(arrayItems)

            const mailOptions = {
                from: "remitente", // sender address
                to: booking.client.email, // list of receivers
                subject: "Cita en WorkOut", // Subject line
                //text: "Hello world?", // plain text body
                html: `

                <p>Su cita se registró con éxito</p>
        <p>✨ Será un gusto poder atenderle❗️ Por favor tomar en cuenta las siguientes recomendaciones para su cita de depilación 💖</p>
        <ul>
            <li>✅ Su vello debe estar mínimo del tamaño de un grano de arroz para poderlo extraer desde la raíz</li>
            <li>✅ Su piel debe estar libre de cremas y aceites</li>
            <li>✅ Recuerde estar puntual, nuestra tolerancia es de 5 min de espera</li>
        </ul>
        <p>Gracias por ser parte de la experiencia Workout⭐️🌈</p>
    
                    <p>A continuación se presentan los detalles de su cita:</p>
                   
    
                    <strong>Local, fecha, hora: </strong>: <br>
                    <ul>
                    <li><strong>Local:</strong> ${booking.local.name}</li>
                    <li> <strong>Fecha:</strong> ${booking.date}</li>
                    <li><strong>Hora:</strong> ${booking.hour}</li>
                    </ul>
    
                    <strong>Servicios: </strong>: <br>
                    <ul>
                       ${arrayItems}
                    </ul>

                    <p>Duración Total: ${booking.duration} minutos</p>
    
                   
                    
                    <p>Si quieres cambiar el horario y el local de tu cita puedes hacerlo <a href="${modifyLink}"> Dando Click Aquí</a></p>
    
                    <p>Puedes Eliminar tu cita <a href="${deleteLink}"> Dando Click Aquí</a></p>
                    
                    `
                //text: "Hola mundo"
            }

            transporter.sendMail(mailOptions, (error, info) => {
                //console.log("entre");

                if (error) {


                    res.status(500).send({ status: false, error: error.message })

                } else {
                    // console.log("entre al else");
                    res.status(200).send({
                        status: true,
                        message: "Agenda Actualizada"
                    })

                }

            })

        } else {

            res.status(400).send({
                status: false,
                message: "No existen servicios"
            })
        }




    } catch (error) {

        console.log(error)

        res
            .status(400).send({
                status: false,
                message: "Error al actualizar agenda"
            })

    }







}




function formatHora(hora) {
    const horaEntera = Math.floor(hora);
    const minutos = (hora - horaEntera) * 60;
    const minutosFormateados = minutos < 10 ? `0${minutos}` : minutos;
    //const ampm = horaEntera >= 12 ? 'PM' : 'AM';
    return `${horaEntera}:${minutosFormateados}`;
}


function limpiarHoras2(horasArray) {
    const horasLimpias = [];

    horasArray.forEach(hora => {
        let horaLimpia = hora.trim(); // Elimina espacios en blanco al principio y al final

        if (horaLimpia.endsWith("AM AM")) {
            horaLimpia = horaLimpia.replace("AM AM", "AM");
        } else if (horaLimpia.endsWith("PM PM")) {
            horaLimpia = horaLimpia.replace("PM PM", "PM");
        }

        horasLimpias.push(horaLimpia);
    });

    return horasLimpias;
}


function formatFecha(fecha) {
    const partes = fecha.split('.');
    if (partes.length >= 2) {
        const horaPartes = partes[0].split(':');
        if (horaPartes.length === 2) {
            const horas = parseInt(horaPartes[0]);
            const minutos = parseInt(horaPartes[1]);
            const segundosFraccion = parseFloat(`0.${partes[1]}`);
            const segundos = Math.floor(segundosFraccion * 60);

            const ampm = horas >= 12 ? 'PM' : 'AM';
            const horas12 = horas > 12 ? horas - 12 : horas;

            return `${horas12}:${minutos < 10 ? '0' : ''}${minutos}.${segundos < 10 ? '0' : ''}${segundos} ${ampm}`;
        }
    }
    return fecha; // Devuelve la fecha original si no se puede formatear
}


function parseHora(hora) {
    const parts = hora.split(':');
    const horaEntera = parseInt(parts[0], 10);
    const minutos = parseInt(parts[1], 10) / 60;
    return horaEntera + minutos;
}



//Crear servicio
bookingCtrl.create = async (req, res) => {



    let date = new Date();
    let strTime = date.toLocaleString("en-US", { timeZone: "America/Bogota" });
    const { nombre, apellido, genero, correo, numero, employe, servicios, duracion, local_id, fecha, hora, hora_fin, empleado } = req.body;




    let local;



    if (!mongoose.Types.ObjectId.isValid(local_id)) {

        //console.log("entree")

        return res.status(400).send({
            status: false,
            message: "Id local no valido"
        })

    }

    try {




        local = await LocalModel.findById(local_id)

        if (!local) {
            res.status(400).send({
                status: false,
                message: "Local no encontrado"
            })
        }
    } catch (error) {

        console.log(error)

        res.status(400).send({
            status: false,
            message: "Error"
        })

    }

    //console.log("nombre", local.name)




    try {

        let serviciosEncontrados = []

        //console.log("entre")

        for (let index = 0; index < servicios.length; index++) {

            const servicioFinded = await ServiceModal.findById(servicios[index]._id)

            if (servicioFinded) {
                serviciosEncontrados.push(servicioFinded.name)
            }

        }




        let contact = await contactModal.findOne({ "client.number": numero })

        if (!contact) {

            const contact = new contactModal({
                local: {
                    _id: local._id,
                    name: local.local
                },
                date: fecha,
                hour: hora,
                hour_end: hora_fin,
                client: {
                    number: numero,
                    email: correo,
                    name: nombre,
                    lastName: apellido,
                    gender: genero
                },
                employe: empleado,
                duration: duracion,
                services: serviciosEncontrados,
                state: "Reservado",

            })

            await contact.save()

        }


        const booking = new bookingModal({

            local: {
                _id: local._id,
                name: local.local
            },

            date: fecha,
            hour: hora,
            hour_end: hora_fin,
            client: {
                number: numero,
                email: correo,
                name: nombre,
                lastName: apellido,
                gender: genero
            },
            employe: empleado,
            duration: duracion,
            services: serviciosEncontrados,
            state: "Reservado",



        })

        const token = JWT.sign({
            email: booking.client.email,
            number: booking.client.number,
            fecha: booking.date,
            hour: booking.hour
        }, "RESET", { expiresIn: "168h" })

        booking.token = token

        console.log("booking", booking)


        await booking.save()



        const modifyLink = `${process.env.URL_FRONTEND}/modify/${token}`

        const deleteLink = `${process.env.URL_FRONTEND}/delete/${token}`


        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL, // generated ethereal user
                pass: process.env.TOKEN_EMAIL, // generated ethereal password
            },
        });

        var arrayItems = "";
        ;
        for (var i = 0; i < servicios.length; i++) {
            arrayItems += "<li>" + servicios[i].name + "</li>";

        }

        const mailOptions = {
            from: "remitente", // sender address
            to: correo, // list of receivers
            subject: "Cita en WorkOut", // Subject line
            //text: "Hello world?", // plain text body
            html: `

            <p>Su cita se registró con éxito</p>
    <p>✨ Será un gusto poder atenderle❗️ Por favor tomar en cuenta las siguientes recomendaciones para su cita de depilación 💖</p>
    <ul>
        <li>✅ Su vello debe estar mínimo del tamaño de un grano de arroz para poderlo extraer desde la raíz</li>
        <li>✅ Su piel debe estar libre de cremas y aceites</li>
        <li>✅ Recuerde estar puntual, nuestra tolerancia es de 5 min de espera</li>
    </ul>
    <p>Gracias por ser parte de la experiencia Workout⭐️🌈</p>

                <p>A continuación se presentan los detalles de su cita:</p>
               

                <strong>Local, fecha, hora: </strong>: <br>
                <ul>
                <li><strong>Local:</strong> ${booking.local.name}</li>
                <li> <strong>Fecha:</strong> ${booking.date}</li>
                <li><strong>Hora:</strong> ${booking.hour}</li>
                </ul>

                <strong>Servicios: </strong>: <br>
                <ul>
                   ${arrayItems}
                </ul>

               
                <p>Duración Total: ${duracion} minutos</p>


                <p>Si quieres cambiar el horario y el local de tu cita puedes hacerlo <a href="${modifyLink}"> Dando Click Aquí</a></p>

                <p>Puedes Eliminar tu cita <a href="${deleteLink}"> Dando Click Aquí</a></p>
                
                `, // html 

        }

        transporter.sendMail(mailOptions, (error, info) => {
            //console.log("entre");

            if (error) {

                console.log("entree", error)


                res.status(500).send({ status: false, error: error.message })

            } else {
                // console.log("entre al else");
                res.status(200).send({
                    status: true,
                    message: "Agenda Creado"
                })

            }

        })





    } catch (error) {

        console.log(error)
        res.status(400).send({
            status: true,
            message: "Error al crear la agenda"
        })


    }









}


//checkToken

bookingCtrl.checkToken = async (req, res) => {


    let token = req.headers.token

    let booking

    if (!token) {
        res.status(200).send({
            status: false,
            message: "Token Requerido"
        })
    } else {

        try {

            booking = await bookingModal.findOne({ token: token })




            if (!booking) {
                res.status(200).send({
                    status: false,
                    message: "No existe ella agenda"
                })
            } else {
                res.status(200).send({
                    status: true,

                })
            }



        } catch (error) {

            res.status(200).send({
                status: false,
                message: "Algo ocurrió mal"
            })

        }
    }
}

bookingCtrl.delete = async (req, res) => {

    let id = req.params.id


    if (!mongoose.Types.ObjectId.isValid(id)) {


        return res.status(400).send({
            status: false,
            message: "Id no valido"
        })

    }

    try {

        await bookingModal.deleteOne({ _id: id })

        res.status(200).send({
            status: true,
            message: "Agenda Eliminada"
        })

    } catch (error) {

        res.status(400).send({
            status: true,
            message: "Error al eliminar agenda"
        })

    }




}


bookingCtrl.changeState = async (req, res) => {


    console.log("!!!!!!!!!!!!!!!!!!")

    let id = req.params.id


    if (!mongoose.Types.ObjectId.isValid(id)) {


        return res.status(400).send({
            status: false,
            message: "Id no valido"
        })

    }


    let booking = await bookingModal.findById(id)

    if (!booking) {

        return res.status(400).send({
            status: false,
            message: "No existe la agenda"
        })
    }

    try {

        booking.state = 'realizada'

        // Elimina la propiedad 'token' del documento
        delete booking.token;

        await booking.save();


        return res.status(200).send({
            status: true,
            message: 'Cambiado a Realizada'
        })

    } catch (error) {

        return res.status(400).send({
            status: false,
            message: 'Error al actualizar agenda'
        })

    }












}





//Actualziar servicio

/*
localCtrl.update = async (req, res) => {
 
}
 
 
//Eliminar servicio
 
localCtrl.delete = async (req, res) => {
 
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
}*/

bookingCtrl.generateHorasDisponibles4 = async (req, res) => {
    const { fechaSeleccionada, id, duration } = req.body
    const horas = [];
    const intervalo = 0.1667;
    const fecha = new Date(fechaSeleccionada)
    fecha.setDate(fecha.getDate() + 1)

    const diaSeleccionado = new Date(fecha).toLocaleDateString('es-ES', { weekday: 'long', timeZone: "America/Bogota" });

    const local = await LocalModel.findById(id)



    const employes = local.employees

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

        const horasGood = (corregirHorasConDecimales(horas))

        // Crear un objeto para almacenar los horarios disponibles por empleado
        const horariosDisponiblesPorEmpleado = {};

        // Inicializar el objeto con todos los horariosGood
        for (let empleado = 1; empleado <= employes; empleado++) {
            horariosDisponiblesPorEmpleado[empleado] = [...horasGood];
        }

        const bookingSameDate = await bookingModal.find({ date: fechaSeleccionada, "local._id": local._id })

        const horariosDisponibles = obtenerHoraEmpleado(bookingSameDate, employes, horasGood, duration);

        console.log("sasa", horariosDisponibles)

        return res.status(200).send({
            status: true,
            horariosDisponibles: horariosDisponibles

        });

    } else {
        return res.status(400).send({
            status: false,
            error: "No es econtró"

        });
    }
}
module.exports = bookingCtrl;
