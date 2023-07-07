let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});

function iniciarApp(){
    mostrarSeccion(); //muestra y oculta las secciones
    tabs(); //cambia de seccion cuando se precionan los tabs
    botonesPaginador(); //agrega o quita secciones segun el boton
    paginaAnterior();
    paginaSiguiente();

    consultarAPI(); //consulta la API en el backend de PHP
    idCliente(); //Añade id al objeto cita
    nombreCliente(); //añade al objeto de cita
    seleccionarFecha(); //añade la fecha al objeto cita
    seleccionarHora(); //agrega la hora al objeto
    mostrarResumen(); //mostrar el resumen
}

function mostrarSeccion(){
    // Ocultar la seccion que tenha la clase de mostrrar

    const seccionAnterior = document.querySelector('.mostrar');
    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar');
    }

    // seleccionar la seccion con el paso
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    // Quita la clase actual al tab anterior
    const tabAnterior = document.querySelector('.actual');
    if(tabAnterior){
        tabAnterior.classList.remove('actual');
    }

    // resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
}

function tabs(){
    const botones = document.querySelectorAll('.tabs button');
    botones.forEach( boton => {
        boton.addEventListener('click', function(e){
            paso = parseInt(e.target.dataset.paso);

            mostrarSeccion();
            botonesPaginador();
        });
    } );
}

function botonesPaginador(){
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');
    
    if(paso === 1){
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }else if(paso === 3){
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');

        mostrarResumen();
    }else{
        paginaSiguiente.classList.remove('ocultar');
        paginaAnterior.classList.remove('ocultar');
    }

    mostrarSeccion();
    
}

function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function(){
        if(paso <= pasoInicial) return;
        paso--;
        botonesPaginador();
    });
}

function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function(){
        if(paso >= pasoFinal) return;
        paso++;
        botonesPaginador();
    });

}

async function consultarAPI(){
    try {
        const url = `${location.origin}/api/servicios`;
        const resultado = await fetch(url);
        const servicios = await resultado.json();
            mostrarServicios(servicios);
        
    }catch(error){
        console.log(error);
    }
}

function mostrarServicios(servicios){
    servicios.forEach( function(servicio){
        const { id, nombre, precio} = servicio;
        const nombreServicio = document.createElement('p');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('p');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$ ${precio}`;
        
        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        servicioDiv.onclick = function(){
            seleccionarServicio(servicio);
        };

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);
    });
}

function seleccionarServicio(servicio){
    const {id} = servicio;
    const {servicios} = cita;
    // identificar elemento al que se le da click
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);
    // Comprobar si un servicio ya fue agregado
    if( servicios.some( agregado => agregado.id === id)){
        // Emilimar producto
        cita.servicios = servicios.filter(agregado => agregado.id !== id);
        divServicio.classList.remove('seleccionado');
    }else{
        // agregarlo
        cita.servicios = [...servicios, servicio];
        divServicio.classList.add('seleccionado');
    }
    
}

function idCliente(){
    const id = document.querySelector('#id').value;
    cita.id = id;
}

function nombreCliente(){
    const nombre = document.querySelector('#nombre').value;
    cita.nombre = nombre;
    
}

function seleccionarFecha(){
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(e){
        const dia = new Date(e.target.value).getUTCDay();
        if([6, 0].includes(dia)){
            e.target.value = '';
            mostrarAlerta('fines de semana no permitido', 'error', '.formulario');
        }else{
            cita.fecha = e.target.value;
        }
    });
}

function seleccionarHora(){
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(e){

        const horaCita = e.target.value;
        const hora = horaCita.split(":")[0];
        if(hora < 10 || hora > 18) {
            mostrarAlerta('Esta hora no está disponible abrimos de 10am a 6pm', 'error', '.formulario');
        }else{
            cita.hora = e.target.value;
        }
    });
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true){

    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {
        alertaPrevia.remove();
    }
    const alerta = document.createElement('div');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);
    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    if(desaparece){
        setTimeout(() => {
            alerta.remove();
        }, 3000);   
    }
}

function mostrarResumen(){
    const resumen = document.querySelector('.contenido-resumen');
    
    // limpiar el contenido de resumen
    while(resumen.firstChild){
        resumen.removeChild(resumen.firstChild);
    }
    
    if(Object.values(cita).includes('') || cita.servicios.lenght === 0){
        mostrarAlerta('faltan datos de servicios, fecha u hora', 'error', '.contenido-resumen', false);
        return;
    }

    // formatear el div de resumen

    const {nombre, fecha, hora, servicios} = cita;
    
    // heading para servicios en resumen
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de servicios';
    resumen.appendChild(headingServicios);

    // iterando y mostrando los servicios
    servicios.forEach(function(servicio){
        const { id, precio, nombre } = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
    });

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;
    
    // formatear la fecha en español
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
    const year = fechaObj.getFullYear();


    const opciones = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    const fechaUTC = new Date( Date.UTC(year, mes, dia));
    const fechaFormateada = fechaUTC.toLocaleDateString('es-MX', opciones);
    

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;
    
    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora} horas`;

        // heading para servicios en resumen
        const headingCita = document.createElement('H3');
        headingCita.textContent = 'Resumen de cita';
        resumen.appendChild(headingCita);

        const botonReservar = document.createElement('BUTTON');
        botonReservar.classList.add('boton');
        botonReservar.textContent = 'Reservar Cita';
        botonReservar.onclick = reservarCita;
    

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);
    resumen.appendChild(botonReservar);
    
}

async function reservarCita(){
    const { id, fecha, hora, servicios } = cita;
    const idServicios = servicios.map(servicio => servicio.id);
    // console.log(idServicios);
    
    const datos = new FormData();
    datos.append('usuarioId', id);
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('servicios', idServicios);

    // console.log([...datos]);
    try {
            // Peticion hacia la api
    const url = `${location.origin}/api/citas`;
    const respuesta = await fetch(url, {
        method: 'POST',
        body: datos
    });

    const resultado = await respuesta.json();
    if(resultado.resultado){
        Swal.fire({
            icon: 'success',
            title: 'Cita Creada',
            text: 'Tu cita fue creada correctamente',
            button: 'OK'
          }).then(() => {
            setTimeout(() => {
                window.location.reload();
            }, 3000);
            
          });
    }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Algo salió mal, no se registró tu cita!',
            
          })
    }

}