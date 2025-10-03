// ========================================
// CLASE PARA MANEJAR IDs AUTOMÁTICOS
// ========================================
// Esta clase se encarga de generar IDs únicos para cada registro
class IdManager {
    
    // Función que busca el siguiente ID disponible
    // Recibe: endpoint (países, regiones, etc.)
    // Devuelve: el siguiente número de ID disponible
    static async getNextId(endpoint) {
        try {
            // Pedir todos los datos del servidor
            const response = await fetch(`http://localhost:3001/${endpoint}`);
            const data = await response.json();
            
            // Si hay datos, buscar el ID más alto
            if (data.length > 0) {
                let maxId = 0;
                // Revisar cada registro para encontrar el ID más alto
                for (let item of data) {
                    let itemId = parseInt(item.id) || 0;
                    if (itemId > maxId) {
                        maxId = itemId;
                    }
                }
                // Devolver el siguiente ID (el más alto + 1)
                return (maxId + 1).toString();
            }
            
            // Si no hay datos, empezar con ID 1
            return "1";
        } catch (error) {
            // Si hay error, empezar con ID 1
            return "1";
        }
    }
    
    // Función que crea un nuevo registro con ID automático
    // Recibe: endpoint (países, regiones, etc.) y los datos del registro
    // Devuelve: respuesta del servidor
    static async createWithSequentialId(endpoint, data) {
        // Obtener el siguiente ID disponible
        const nextId = await this.getNextId(endpoint);
        // Agregar el ID a los datos
        const dataWithId = { ...data, id: nextId };
        
        // Enviar los datos al servidor
        return fetch(`http://localhost:3001/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataWithId)
        });
    }
}

// ========================================
// FUNCIÓN PARA CONTROLAR BOTONES
// ========================================
// Esta función activa y desactiva botones según la configuración
// Recibe: string JSON con configuración de botones
function ctrlBtn(e) {
    // Convertir el string JSON a un objeto
    const buttonData = JSON.parse(e);
    const buttonsToEnable = buttonData[0];  // Lista de botones a activar
    const buttonsToDisable = buttonData[1]; // Lista de botones a desactivar
    
    // Activar botones (quitar clase disabled y atributo disabled)
    for (let buttonSelector of buttonsToEnable) {
        let button = document.querySelector(buttonSelector);
        if (button) {
            button.classList.remove('disabled');
            button.removeAttribute('disabled');
        }
    }
    
    // Desactivar botones (agregar clase disabled y atributo disabled)
    for (let buttonSelector of buttonsToDisable) {
        let button = document.querySelector(buttonSelector);
        if (button) {
            button.classList.add('disabled');
            button.setAttribute('disabled', 'disabled');
        }
    }
}

// ========================================
// FUNCIONES AUXILIARES
// ========================================

// Función para limpiar el ID que se muestra en pantalla
// Se usa cuando se cancela una operación o se inicia una nueva
function resetIdView() {
    let idViewElement = document.querySelector('#idView');
    if (idViewElement) {
        idViewElement.innerHTML = '';
    }
}

// Función para mostrar un ID en pantalla
// Se usa cuando se crea o edita un registro
// Recibe: el ID a mostrar
function viewData(id) {
    let idViewElement = document.querySelector('#idView');
    if (idViewElement) {
        idViewElement.innerHTML = id;
    }
}

// Función para activar todos los botones que tienen configuración
// Se ejecuta al cargar cada formulario
function enabledBtns() {
    let allButtons = document.querySelectorAll(".btn[data-ed]");
    for (let button of allButtons) {
        ctrlBtn(button.dataset.ed);
    }
}

// Función para limpiar y deshabilitar un formulario
// Recibe: estado (true para deshabilitar, false para habilitar) y el ID del formulario
function disableFrm(estado, formId) {
    let form = document.querySelector(formId);
    if (form) {
        // Recorrer todos los elementos del formulario
        for (let element of form.elements) {
            // Solo limpiar campos que no sean botones
            if (element.type !== 'button' && element.type !== 'submit') {
                element.value = '';        // Limpiar el valor
                element.disabled = estado; // Habilitar o deshabilitar
            }
        }
    }
}

// ========================================
// FUNCIÓN PARA NAVEGACIÓN ENTRE PESTAÑAS
// ========================================
// Esta función maneja el cambio entre "Registrar" y "Listar"
// Recibe: prefix (país, región, etc.) y listMethod (método para recargar lista)
function setupTabNavigation(prefix, listMethod) {
    // Buscar todos los botones de navegación del módulo
    let navigationButtons = document.querySelectorAll(`.mnu${prefix}`);
    
    // Agregar evento de clic a cada botón
    for (let button of navigationButtons) {
        button.addEventListener("click", function(event) {
            // Obtener configuración de qué mostrar y ocultar
            let navigationData = JSON.parse(event.target.dataset.verocultar);
            let elementToShow = navigationData[0];    // Elemento a mostrar
            let elementsToHide = navigationData[1];   // Elementos a ocultar
            
            // Mostrar el elemento seleccionado
            let showElement = document.querySelector(elementToShow);
            if (showElement) {
                showElement.style.display = 'block';
            }
            
            // Ocultar los otros elementos
            for (let elementSelector of elementsToHide) {
                let hideElement = document.querySelector(elementSelector);
                if (hideElement) {
                    hideElement.style.display = 'none';
                }
            }
            
            // Si se está mostrando una lista, recargar los datos
            if (elementToShow.includes('lst')) {
                let listComponent = document.querySelector(`lst-${prefix}`);
                if (listComponent && listComponent[listMethod]) {
                    listComponent[listMethod]();
                }
            }
            
            // Prevenir comportamiento por defecto del enlace
            event.stopImmediatePropagation();
            event.preventDefault();
        });
    }
}

// ========================================
// EXPORTAR FUNCIONES GLOBALMENTE
// ========================================
// Hacer todas las funciones disponibles en toda la aplicación
window.IdManager = IdManager;
window.ctrlBtn = ctrlBtn;
window.resetIdView = resetIdView;
window.viewData = viewData;
window.enabledBtns = enabledBtns;
window.disableFrm = disableFrm;
window.setupTabNavigation = setupTabNavigation;

// ========================================
// IMPORTAR COMPONENTES
// ========================================
// Cargar todos los componentes de la aplicación
import '/App/Components/navMenu/navMenu.js';           // Menú de navegación
import '/App/Components/countries/countryComponent.js'; // Módulo de países
import '/App/Components/regions/regionComponent.js';    // Módulo de regiones
import '/App/Components/cities/cityComponent.js';       // Módulo de ciudades
import '/App/Components/companies/companyComponent.js'; // Módulo de empresas
import '/App/Components/branches/brancComponent.js';    // Módulo de sucursales