<script>
  import { db } from "./firebase.js";
  import Header from "./components/Header.svelte";
  import Footer from "./components/Footer.svelte";
  import {
    Datatable,
    ColumnFilterInputs,
    rows,
  } from "svelte-simple-datatables";
  import { onMount } from 'svelte';  
  const settings = {
    columnFilter: true,
    pagination: true,
    css: true,
    rowPerPage: 10,
    scrollY: false,
    labels: {
      noRows: "Sin resultados",
      search: "Buscar...",
      filter: "Filtrar",
      info: "Mostrando resultados del {start} al {end} de {rows} registros encontrados (horas semanales de clase).",
      previous: "Anterior",
      next: "Siguiente",
    },
  };
  let data = [];
  let tabla = [];
  db.on("value", (snapshot) => {
    const data2 = snapshot.val();
    data2.forEach((element) => {
      let carreras = element.Proyectos_curriculares;
      carreras.forEach((proyectos) => {
        let espacios = proyectos.espacios;
        espacios.forEach((materias) => {
          let grupos = materias.grupos;
          grupos.forEach((otros) => {
            let lugar = otros.lugar;
            lugar.forEach((otros3) => {
              let horas = otros3.horas;
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
    data = tabla;
  });


  let events = [
    { day: 'Monday', time: '10:00 AM', eventName: 'Meeting 1' },
    { day: 'Wednesday', time: '02:30 PM', eventName: 'Meeting 2' },
    { day: 'Friday', time: '11:00 AM', eventName: 'Meeting 3' },
    // Add more events as needed
  ];

  let calendarData = [];

  onMount(() => {
    populateCalendar();
  });

  function populateCalendar() {
    // Define the time slots (adjust as needed)
    const timeSlots = [
      '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
      '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
      '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
      '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
      '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM',
    ];

    // Loop through each time slot
    timeSlots.forEach(timeSlot => {
      const row = { time: timeSlot, cells: [] };

      // Loop through each day of the week
      ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].forEach(day => {
        const event = events.find(e => e.day === day && e.time === timeSlot);
        const cell = { day, event: event ? event.eventName : null };

        row.cells.push(cell);
      });

      calendarData.push(row);
    });
  }

</script>

<Header />
<main>
  <Datatable {settings} {data}>
    <thead>
      <tr>
        <th class="sortable asc desc" data-key="Grp">Grp<span /></th>
        <th class="sortable asc desc" data-key="Proyecto_curricular"
          >Proyecto<span /></th
        >
        <th class="sortable asc desc" data-key="Cod">Cod<span /></th>
        <th class="sortable asc desc" data-key="Espacio_Academico"
          >Asignatura<span /></th
        >
        <th class="sortable asc desc" data-key="Dia">Dia<span /></th>
        <th class="sortable asc desc" data-key="Hora">Hora <span /></th>
        <th class="sortable asc desc" data-key="Sede">Sede<span /></th>
        <th class="sortable asc desc" data-key="Edificio">Edificio<span /></th>
        <th class="sortable asc desc" data-key="Salon">Salon<span /></th>
        <th class="sortable asc desc" data-key="Docente">Docente<span /></th>
        <th class="sortable asc desc" data-key="INSCRITOS">Inscritos<span /></th
        >
      </tr>
      <ColumnFilterInputs />
    </thead><tbody>
      {#each $rows as row}
        <tr>
          <td>{row.Grp}</td>
          <td>{row.Proyecto_curricular}</td>
          <td>{row.Cod}</td>
          <td>{row.Espacio_Academico}</td>
          <td>{row.Dia}</td>
          <td>{row.Hora}</td>
          <td>{row.Sede}</td>
          <td>{row.Edificio}</td>
          <td>{row.Salon}</td>
          <td>{row.Docente}</td>
          <td>{row.INSCRITOS}</td>
        </tr>
      {/each}
    </tbody>
  </Datatable>
  <br><br>

  <h2>Weekly Calendar Scheduler</h2>

<table>
  <thead>
    <tr>
      <th>Time</th>
      {#each ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as day}
        <th>{day}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each calendarData as { time, cells }}
      <tr>
        <td>{time}</td>
        {#each cells as { day, event }}
          <td>{#if event}{event}{/if}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

</main>
<Footer />

<style>
  th:first-child {
    width: 72px;
  }
  th {
    padding: 8px 0px 8px 16px;
    text-align: left;
    border-bottom: 1px solid #eee;
    background: #fff;
    font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  }

  /* Cambria, Cochin, Georgia, Times, 'Times New Roman', serif 
	Arial, Helvetica, sans-serif
	'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif
	*/
  th.sortable {
    cursor: pointer;
  }
  th.sortable span {
    padding-right: 16px;
    position: relative;
  }
  th.sortable span:before,
  th.sortable span:after {
    border: 4px solid transparent;
    content: "";
    display: block;
    height: 0;
    right: 0;
    top: 50%;
    position: absolute;
    width: 0;
  }
  th.sortable span:before {
    border-bottom-color: #e0e0e0;
    margin-top: -9px;
  }
  th.sortable span:after {
    border-top-color: #e0e0e0;
    margin-top: 1px;
  }
  th.sortable.asc:not(.desc) span:before {
    border-bottom-color: #9e9e9e;
  }
  th.sortable.desc:not(.asc) span:after {
    border-top-color: #9e9e9e;
  }
  td {
    text-align: left;
    font-size: 14px;
    padding: 4px 0;
  }
  main {
    max-width: 99%;
    margin: 40px auto;
  }
</style>
