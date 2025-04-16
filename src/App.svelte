<script>
  import { db } from "./firebase.js";
  import { transformData } from "./utils/transformData.js";
  import Header from "./components/Header.svelte";
  import Footer from "./components/Footer.svelte";
  import { Datatable, ColumnFilterInputs, rows } from "svelte-simple-datatables";
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
  let loading = true;
  let error = null;
  let uniqueEspacios = []; // Lista de valores únicos de Espacio_Academico
  let selectedEspacio = ""; // Valor seleccionado en el formulario
  let filteredData = []; // Datos filtrados por Espacio_Academico
  let uniqueGrps = []; // Lista de valores únicos de Grp
  let selectedGrp = ""; // Valor seleccionado en el formulario de Grp
  let errorMessage = ""; // Mensaje de error para mostrar conflictos de horarios
  let cellColors = {}; // Objeto para almacenar colores de las celdas
  let horarios = Array(17).fill(null).map(() => ({
    lunes: "",
    martes: "",
    miercoles: "",
    jueves: "",
    viernes: "",
    sabado: "",
    domingo: "",
  }));
  // Escuchar cambios en la base de datos y transformar los datos
  db.on("value", (snapshot) => {
    const data2 = snapshot.val();
    try {
      data = transformData(snapshot.val());
      uniqueEspacios = [...new Set(data.map((item) => item.Espacio_Academico))]; // Extraer valores únicos
      loading = false;
    } catch (err) {
      error = "Error al cargar los datos.";
      loading = false;
    }
  });
  
  function handleEspacioSubmit(event) {
    event.preventDefault();
    if (selectedEspacio) {
      // Filtrar las ocurrencias asociadas al Espacio_Academico seleccionado
      filteredData = data.filter(
        (item) => item.Espacio_Academico === selectedEspacio
      );

      // Generar valores únicos de Grp a partir de los datos filtrados
      uniqueGrps = [...new Set(filteredData.map((item) => item.Grp))];
    } else {
      console.log("Por favor, seleccione un Espacio Académico.");
    }
  }

  function handleGrpSubmit(event) {
    event.preventDefault();
    errorMessage = ""; // Limpiar mensaje de error
    if (selectedGrp) {
      const grpFilteredData = filteredData.filter((item) => item.Grp === selectedGrp);

      // Generar un color aleatorio para esta selección
      const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)}, 0.5)`; // 0.5 es la opacidad (50%)

      // Validar y agregar los datos a la tabla de horarios
      grpFilteredData.forEach((item) => {
        const horaInicio = parseInt(item.Hora.split("-")[0]); // Extraer la hora inicial
        const dia = item.Dia.toLowerCase(); // Convertir el día a minúsculas
        const fila = horaInicio - 6; // Calcular la fila correspondiente (6:00 es la fila 0)

        if (fila >= 0 && fila < horarios.length && horarios[fila][dia] !== undefined) {
          if (!horarios[fila][dia]) {
            // Si la celda está vacía, asignar el nombre del Grp y el color
            horarios[fila][dia] = item.Espacio_Academico;
            cellColors[`${fila}-${dia}`] = randomColor; // Guardar el color para esta celda
          } else {
            // Si la celda ya está ocupada, mostrar un mensaje de error
            errorMessage = `Conflicto de horario: ya existe un curso asignado el ${item.Dia} a las ${item.Hora}.`;
          }
        }
      });
    } else {
      console.log("Por favor, seleccione un Grp.");
    }
  }


  function resetHorarios() {
    horarios = Array(17).fill(null).map(() => ({
      lunes: "",
      martes: "",
      miercoles: "",
      jueves: "",
      viernes: "",
      sabado: "",
      domingo: "",
    }));
    cellColors = {}; // Limpiar los colores de las celdas
    errorMessage = ""; // Limpiar mensaje de error
  }
</script>

<Header />
<main>
  {#if loading}
  <div class="loader-container">
    <div class="spinner"></div>
    <p>Cargando datos...</p>
  </div>
{:else if error}
  <p>{error}</p>
{:else}
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

  
 
 <!-- Formulario combinado -->
  <!-- Formulario para filtrar por Espacio_Academico -->
  <div class="form-container"> 
  <form on:submit={handleEspacioSubmit}>
    <label for="espacio">Buscar y Seleccionar Espacio Académico:</label>
    <input
      id="espacio"
      list="espacios"
      placeholder="Escribe para buscar..."
      bind:value={selectedEspacio}
    />
    <datalist id="espacios">
      {#each uniqueEspacios as espacio}
        <option value={espacio} />
      {/each}
    </datalist>
    <button type="submit">Buscar grupos</button>
  </form>

  <!-- Formulario para filtrar por Grp -->
  {#if filteredData.length > 0}
  <form on:submit={handleGrpSubmit}>
    <label for="grp">Seleccionar grupo</label>
    <select id="grp" bind:value={selectedGrp}>
      <option value="" disabled selected>Seleccione un grupo</option>
      {#each uniqueGrps as grp}
        <option value={grp}>{grp}</option>
      {/each}
    </select>
    <button type="submit">Buscar horario</button>
  </form>
  {/if}

  {#if errorMessage}
  <p class="error">{errorMessage}</p>
  {/if}

  
</div>   
<button on:click={resetHorarios} class="reset-button">Vaciar tablero</button>
  <table class="horarios">
    <thead>
      <tr>
        <th>Hora</th>
        <th>Lunes</th>
        <th>Martes</th>
        <th>Miércoles</th>
        <th>Jueves</th>
        <th>Viernes</th>
        <th>Sábado</th>
        <th>Domingo</th>
      </tr>
    </thead>
    <tbody>
      {#each horarios as fila, i}
      <tr>
        <td>{i + 6}:00</td>
        <td style="background-color: {cellColors[`${i}-lunes`] || 'transparent'}">{fila.lunes}</td>
        <td style="background-color: {cellColors[`${i}-martes`] || 'transparent'}">{fila.martes}</td>
        <td style="background-color: {cellColors[`${i}-miercoles`] || 'transparent'}">{fila.miercoles}</td>
        <td style="background-color: {cellColors[`${i}-jueves`] || 'transparent'}">{fila.jueves}</td>
        <td style="background-color: {cellColors[`${i}-viernes`] || 'transparent'}">{fila.viernes}</td>
        <td style="background-color: {cellColors[`${i}-sabado`] || 'transparent'}">{fila.sabado}</td>
        <td style="background-color: {cellColors[`${i}-domingo`] || 'transparent'}">{fila.domingo}</td>
      </tr>
      {/each}
    </tbody>
  </table>

  {/if}
</main>
<Footer />

<style>
 table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 16px;
    font-family: 'Arial', sans-serif;
    background-color: #f9f9f9;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  /* Estilo para las cabeceras */
  th {
    background-color: #034470; /* Color de fondo de las cabeceras */
    color: rgb(223, 218, 218); /* Color del texto */
    text-align: left;
    padding: 12px 16px;
    font-weight: bold;
    border-bottom: 2px solid #ddd;
    position: sticky;
    top: 0; /* Hace que las cabeceras sean fijas al hacer scroll */
    z-index: 1;
  }

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
    border-bottom-color: #fff;
  }

  th.sortable.desc:not(.asc) span:after {
    border-top-color: #fff;
  }

  /* Estilo para las filas */
  td {
    padding: 12px 16px;
    border-bottom: 1px solid #ddd;
    text-align: left;
    color: #333;
  }

  /* Alternar colores en las filas */
  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  tr:hover {
    background-color: #eaf2f8; /* Color al pasar el mouse */
  }

  /* Estilo para el contenedor principal */
  main {
    max-width: 95%;
    margin: 40px auto;
    overflow-x: auto; /* Permite scroll horizontal si la tabla es muy ancha */
  }

  /* Estilo para el mensaje de "Sin resultados" */
  .datatable-empty {
    text-align: center;
    padding: 20px;
    font-size: 18px;
    color: #555;
  }

  /* Estilo para la paginación */
  .datatable-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    font-size: 14px;
    color: #555;
  }

  .datatable-pagination button {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 8px 12px;
    margin: 0 5px;
    cursor: pointer;
    border-radius: 4px;
    font-size: 14px;
  }

  .datatable-pagination button:hover {
    background-color: #2980b9;
  }

  .datatable-pagination button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  .loader-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
  }

  .spinner {
    border: 4px solid #f3f3f3; /* Color del fondo */
    border-top: 4px solid #3498db; /* Color del spinner */
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .loader-container p {
    margin-top: 10px;
    font-size: 16px;
    color: #555;
    font-family: Arial, sans-serif;
  }
  form {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 400px;
  }

  label {
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }

  select {
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    padding: 10px 15px;
    font-size: 14px;
    color: white;
    background-color: #3498db;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: #2980b9;
  }
  .horarios {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    font-size: 14px;
    text-align: center;
    background-color: #f9f9f9;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .horarios th,
  .horarios td {
    border: 1px solid #ddd;
    padding: 8px;
  }

  .horarios th {
    background-color: #034470;
    color: white;
    font-weight: bold;
  }

  .horarios tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  .horarios tr:hover {
    background-color: #eaf2f8;
  }

  .horarios td {
    height: 40px;
  } 

  .reset-button {
    margin-top: 20px;
    padding: 10px 15px;
    font-size: 14px;
    color: white;
    background-color: #e74c3c;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .reset-button:hover {
    background-color: #c0392b;
  }
    /* Estilo para celdas seleccionadas */
    .form-container {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-top: 20px;
    flex-wrap: wrap; /* Permite que los elementos se ajusten en varias líneas si no caben */
  }

  .form-container form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .form-container label {
    font-size: 14px;
    font-weight: bold;
    color: #333;
  }

  .form-container input,
  .form-container select {
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .form-container button {
    padding: 10px 15px;
    font-size: 14px;
    color: white;
    background-color: #3498db;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .form-container button:hover {
    background-color: #2980b9;
  }
  .error {
    color: red;
    font-weight: bold;
    margin-top: 10px;
  } 
</style>