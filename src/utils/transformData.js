export function transformData(snapshot) {
  const tabla = [];
  snapshot.forEach((element) => {
    const carreras = element.Proyectos_curriculares;
    carreras.forEach((proyectos) => {
      const espacios = proyectos.espacios;
      espacios.forEach((materias) => {
        const grupos = materias.grupos;
        grupos.forEach((otros) => {
          const lugar = otros.lugar;
          lugar.forEach((otros3) => {
            const horas = otros3.horas;
            horas.forEach((hora) => {
              tabla.push({
                Grp: otros.Grp,
                Proyecto_curricular: proyectos.Proyecto_curricular,
                Cod: materias.Cod,
                Espacio_Academico: materias.Espacio_Academico,
                Dia: otros3.Dia,
                Hora: hora.Hora,
                Sede: element.Sede,
                Edificio: otros3.Edificio,
                Salon: otros3.Salon,
                Docente: otros.Docente,
                INSCRITOS: otros.INSCRITOS,
              });
            });
          });
        });
      });
    });
  });
  return tabla;
}