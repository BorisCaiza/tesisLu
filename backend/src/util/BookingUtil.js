function obtenerHoraEmpleado(bookingSameDate , employes, horasGood, duration) {

  const horariosDisponibles = [];
 /* const duration = 20;
  bookingSameDate = [
    {hour: '10:00', duration: 5, employe: 1 },  //1
    {hour: '10:00', duration: 10, employe: 2 },  //2
    {hour: '10:10', duration: 15, employe: 1 }, //3
    {hour: '10:20', duration: 20, employe: 2 },//4
    {hour: '10:30', duration: 30, employe: 1 },//5
    {hour: '12:00', duration: 15, employe: 1 },//6
    {hour: '11:30', duration: 65, employe: 2 },//7
    {hour: '11:10', duration: 15, employe: 1 },//8
   // {hour: '11:10', duration: 25, employe: 1 },//9
  ]
*/
duration = duration + 5;
  const intervaloTiempo = Math.ceil(duration / 10);

  if (bookingSameDate.length === 0) {
    // Si el array bookingSameDate está vacío, todas las horas y empleados están disponibles.
    for (const hora of horasGood) {
      horariosDisponibles.push({
        hour: hora,
        employees: Array.from({ length: employes }, (_, i) => i + 1), // Todos los empleados están disponibles
      });
    }
  } else {
    const horasDisponiblesPorHora = {};

    for (let employ = 1; employ <= employes; employ++) {
      for (let index = 0; index < horasGood.length; index++) {
        const hora = horasGood[index];
        const horaReservada = bookingSameDate.find(
          (book) => book.hour === hora && book.employe === employ
        );
        if (!horaReservada) { //la hora no esta reservada
          let contTiempo = 0;
          for (let index2 = index; index2 < index + intervaloTiempo; index2++) {
            const hora2 = horasGood[index2];
            const horaReservada2 = bookingSameDate.find(
              (book) => book.hour === hora2 && book.employe === employ
            );
            if (horaReservada2 !== undefined) {
              index = index2 - 1;
              break;
            }
            contTiempo++;
          }
          if (contTiempo === intervaloTiempo) {
            if (!horasDisponiblesPorHora[hora]) {
              horasDisponiblesPorHora[hora] = [];
            }
            horasDisponiblesPorHora[hora].push(employ);
          }
        } else { //la hora esta reservada
          const intervalo2 = Math.ceil(horaReservada.duration / 10);
          index += intervalo2 - 1;
        }
      }
    }

    for (const hora in horasDisponiblesPorHora) {
      horariosDisponibles.push({
        hour: hora,
        employees: horasDisponiblesPorHora[hora],
      });
    }
  }
  horariosDisponibles.sort((a, b) => {
    return a.hour.localeCompare(b.hour);
  });
  console.log(horariosDisponibles);
  return horariosDisponibles;
}

function parseHora(hora) {
  const parts = hora.split(':');
  const horaEntera = parseInt(parts[0], 10);
  const minutos = parseInt(parts[1], 10) / 60;
  return horaEntera + minutos;
}
function formatHora(hora) {
  const horaEntera = Math.floor(hora);
  const minutos = (hora - horaEntera) * 60;
  const minutosFormateados = minutos < 10 ? `0${minutos}` : minutos;
  //const ampm = horaEntera >= 12 ? 'PM' : 'AM';
  return `${horaEntera}:${minutosFormateados}`;
}
function corregirHorasConDecimales(horas) {
  const horasCorregidas = horas.map(hora => {
      const [horaMinuto, decimal] = hora.split('.');
      const [hora2, minutos] = horaMinuto.split(':');
      return `${hora2}:${minutos.padStart(2, '0')}`;
  });
  return horasCorregidas;
}
module.exports = { obtenerHoraEmpleado, parseHora, formatHora, corregirHorasConDecimales };
