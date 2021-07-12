<script>
	import { db } from './firebase.js'
	import Header from './components/Header.svelte';
	import Footer from './components/Footer.svelte';
	import { Datatable, ColumnFilterInputs,rows } from 'svelte-simple-datatables'

    const settings = {			
		columnFilter: true,
		pagination: true,        
		css: true,
        rowPerPage: 10,       
		scrollY: false,		         
		labels: {
            noRows:   'Sin resultados',
            search:   'Buscar...',    // search input placeholer
            filter:   'Filtrar',    // filter inputs placeholder
            info:     'Mostrando resultados del {start} al {end} de {rows} registros encontrados (horas semanales de clase).',
            previous: 'Anterior',
            next:     'Siguiente',       
        }
    }
	let data = [];
	db.on('value', (snapshot) => {		
		data = snapshot.val();
	});
	
	
	
</script>

<Header />
<main>	
	<Datatable {settings} {data}>
		<thead>
			<tr>
				<th class="sortable asc desc" data-key="Grp">Grp<span/></th>
				<th class="sortable asc desc" data-key="Proyecto_curricular">Proyecto<span/></th>
				<th class="sortable asc desc" data-key="Cod">Cod<span/></th>
				<th class="sortable asc desc" data-key="Espacio_Academico">Asignatura<span/></th>
				<th class="sortable asc desc" data-key="Dia">Dia<span/></th>
				<th class="sortable asc desc" data-key="Hora">Hora <span/></th>
				<th class="sortable asc desc" data-key="Sede">Sede<span/></th>				
				<th class="sortable asc desc" data-key="Edificio">Edificio<span/></th>																			
				<th class="sortable asc desc" data-key="Salon">Salon<span/></th>
				<th class="sortable asc desc" data-key="Docente">Docente<span/></th>
				<th class="sortable asc desc" data-key="INSCRITOS">Inscritos<span/></th>
			</tr>
			<ColumnFilterInputs/>
		<tbody>
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
</main>
<Footer />

<style>
	th:first-child{width:72px;}
	th {
        padding: 8px 0px 8px 16px;
        text-align: left;
        border-bottom: 1px solid #eee;
        background: #fff;
		font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif ;
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
        content: '';
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
    td{text-align:left;font-size: 14px;padding:4px 0} 
	main {	
		max-width: 99%;
		margin: 40px auto;
	}

</style>