// array para marcar las tareas con prioridad
let tareasPrioridad = [];

// funcion para mostrar las notificaciones 
function mostrarNotificacion(mensaje, tipo) {
    // ========== PASO 1: SELECCIONAR LOS ELEMENTOS DEL TOAST EN EL HTML ==========
    
    // Selecciona el contenedor completo del Toast (la caja de notificación)
    // En HTML está definido como: <div id="notificacionToast" class="toast">
    // Este div está posicionado en la esquina superior derecha (position-fixed top-0 end-0)
    const toastElement = $('#notificacionToast');
    
    // Selecciona el elemento donde se insertará el TEXTO del mensaje
    // En HTML: <div class="toast-body" id="toast-mensaje">
    // Este es el área donde aparecerá el mensaje dinámico
    const toastMensaje = $('#toast-mensaje');
    
    // ========== PASO 2: INSERTAR EL MENSAJE DINÁMICAMENTE ==========
    
    // Método .text() de jQuery → Inserta texto plano de forma SEGURA (evita XSS)
    // Ejemplo: si mensaje = "Tarea marcada como prioridad", ese texto se muestra
    toastMensaje.text(mensaje);
    
    // ========== PASO 3: APLICAR ESTILOS SEGÚN EL TIPO ==========
    
    // Primero LIMPIAR las clases anteriores para evitar conflictos de estilos
    // Si el toast anterior era 'toast-exito' (verde), debemos quitarla antes de aplicar 'toast-eliminado' (gris)
    toastElement.removeClass('toast-exito toast-eliminado');
    
    // Ahora AGREGAR la clase correspondiente al tipo actual
    // Concatenación de string: 'toast-' + 'exito' = 'toast-exito'
    // Esto activa los estilos CSS definidos en styles.css:
    // - .toast-exito → fondo verde con gradiente
    // - .toast-eliminado → fondo gris con gradiente
    toastElement.addClass('toast-' + tipo);
    
    // ========== PASO 4: CREAR LA INSTANCIA DEL COMPONENTE BOOTSTRAP ==========
    
    // Bootstrap necesita que se instancie el componente Toast para poder controlarlo
    // toastElement[0] → Convierte el objeto jQuery a elemento DOM nativo (requerido por Bootstrap)
    // 
    // Opciones de configuración:
    const toast = new bootstrap.Toast(toastElement[0], {
        autohide: true,    // ¿Se oculta automáticamente? → SÍ
        delay: 3000        // Tiempo en milisegundos antes de ocultarse → 3 segundos (3000ms)
    });
    
    // ========== PASO 5: MOSTRAR EL TOAST EN PANTALLA ==========
    
    // Método .show() → Hace visible el toast con animación de entrada
    // El toast aparecerá en la esquina superior derecha por 3 segundos y luego desaparecerá
    toast.show();
    
    // NOTA PEDAGÓGICA:
    // Los Toasts son notificaciones NO INVASIVAS (no bloquean la interacción del usuario)
    // Se usan para dar FEEDBACK INMEDIATO sin interrumpir el flujo de trabajo
    // Son mejores que alert() porque:
    // 1. No bloquean la ejecución del código
    // 2. Se ven más profesionales
    // 3. Permiten múltiples notificaciones simultáneas
    // 4. Pueden personalizarse con CSS
}


// funcion para actualizar el contador de tareas en el navbar
function actualizarContadorTareas() {
    const cantidad = tareasPrioridad.length;
    $('#contador-prioridades').text(cantidad);
    
    // Animación al cambiar el contador
    $('#contador-prioridades').addClass('pulse-badge');
    setTimeout(() => {
        $('#contador-prioridades').removeClass('pulse-badge');
    }, 500);
}

// funcion para marcar/desmarcar tareas con prioridad
// toggle
function togglePrioridad(tareaId) {
    // ========== PASO 1: SELECCIONAR ELEMENTOS DEL DOM ==========
    
    // Selecciona la tarjeta completa (div con clase .tarjeta-tarea) que contiene el atributo data-tarea-id
    // Ejemplo en HTML: <div class="card tarjeta-tarea" data-tarea-id="1">
    const tarjeta = $(`.tarjeta-tarea[data-tarea-id="${tareaId}"]`);
    
    // Selecciona el botón específico dentro de esa tarjeta
    // Ejemplo en HTML: <button class="btn btn-outline-danger btn-prioridad" data-tarea-id="1">
    const boton = $(`.btn-prioridad[data-tarea-id="${tareaId}"]`);
    
    // Busca dentro de la tarjeta el icono de fuego (que está oculto por defecto con d-none)
    // Ejemplo en HTML: <i class="fas fa-fire icono-prioridad d-none text-warning"></i>
    const iconoPrioridad = tarjeta.find('.icono-prioridad');
    
    // Extrae el texto del título de la tarea para mostrarlo en las notificaciones
    // Ejemplo en HTML: <span class="titulo-tarea">Implementar API REST</span>
    const tituloTarea = tarjeta.find('.titulo-tarea').text();
    
    // ========== PASO 2: VERIFICAR ESTADO ACTUAL ==========
    
    // Buscar si el tareaId ya existe en el array tareasPrioridad
    // indexOf() retorna -1 si NO encuentra el elemento, o su posición si SÍ lo encuentra
    const index = tareasPrioridad.indexOf(tareaId);
    
    // ========== PASO 3: LÓGICA DE TOGGLE (ALTERNANCIA) ==========
    
    if (index === -1) {
        // ===== CASO A: LA TAREA NO ESTÁ MARCADA → AGREGARLA =====
        
        // Agregar el ID al array de tareas prioritarias
        // Esto mantiene un registro en memoria de qué tareas están marcadas
        tareasPrioridad.push(tareaId);
        
        // --- MANIPULACIÓN VISUAL DEL DOM ---
        
        // 1. Agregar clase CSS 'prioridad-alta' a la tarjeta
        //    Esto activa los estilos definidos en styles.css (borde amarillo, animación)
        tarjeta.addClass('prioridad-alta');
        
        // 2. Mostrar el icono de fuego quitándole la clase 'd-none' de Bootstrap
        //    Cambia de <i class="... d-none"> a <i class="..."> (visible)
        iconoPrioridad.removeClass('d-none');
        
        // 3. Cambiar el contenido HTML del botón (texto + icono)
        //    De "Marcar como Prioridad Alta" → "Prioridad Alta Activa"
        //    También cambia el ícono de triángulo de advertencia a check-circle
        boton.html('<i class="fas fa-heart me-2"></i>En Favoritos');
        
        // --- FEEDBACK AL USUARIO ---
        
        // Mostrar notificación toast verde de éxito
        // El template literal (backticks) permite insertar variables con ${}
        mostrarNotificacion(`❤️ "${tituloTarea}" agregado a FAVORITOS`, 'exito');
        
    } else {
        // ===== CASO B: LA TAREA YA ESTÁ MARCADA → QUITARLA =====
        
        // Eliminar el elemento del array usando splice()
        // splice(index, 1) significa: "desde la posición 'index', elimina 1 elemento"
        tareasPrioridad.splice(index, 1);
        
        // --- REVERTIR CAMBIOS VISUALES EN EL DOM ---
        
        // 1. Quitar la clase CSS 'prioridad-alta' de la tarjeta
        //    Esto desactiva el borde amarillo y las animaciones
        tarjeta.removeClass('prioridad-alta');
        
        // 2. Ocultar nuevamente el icono de fuego agregando la clase 'd-none'
        //    Cambia de <i class="..."> a <i class="... d-none"> (oculto)
        iconoPrioridad.addClass('d-none');
        
        // 3. Restaurar el contenido original del botón
        //    De "Prioridad Alta Activa" → "Marcar como Prioridad Alta"
        //    También restaura el ícono de triángulo de advertencia
        boton.html('<i class="fas fa-heart me-2"></i>Agregar a Favoritos');
        
        // --- FEEDBACK AL USUARIO ---
        
        // Mostrar notificación toast gris informativa
        mostrarNotificacion(`💔 "${tituloTarea}" eliminado de FAVORITOS`, 'eliminado');
    }
    
    // ========== PASO 4: ACTUALIZAR EL CONTADOR EN EL NAVBAR ==========
    
    // Llamar a la función que actualiza el badge en la barra de navegación
    // Muestra el número actualizado de tareas prioritarias (ejemplo: "3")
    actualizarContadorTareas();
    
    // NOTA PEDAGÓGICA:
    // Este patrón se llama "Toggle" o "Alternancia" y es FUNDAMENTAL en desarrollo frontend.
    // Lo verás en: favoritos, carritos de compra, likes, switches on/off, etc.
    // La lógica siempre es: verificar estado actual → cambiar al opuesto → actualizar UI
}


// function inicializar los eventos de jquery

function inicializarEventos() {
  $('.btn-prioridad').on('click', function() {
    // obtener el id de la tarea desde el atributo tarea-id que es un atributo personalizado
    const tareaId = $(this).data('tarea-id');
    console.log(tareaId);

    // aplicar efecto visual
    $(this).addClass('clicked');

    setTimeout(() => {
      $(this).removeClass('clicked');
    }, 1000);

    togglePrioridad(tareaId);
  });
}

$(document).ready(function() {
  inicializarEventos();
});