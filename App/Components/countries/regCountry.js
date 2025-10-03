// ========================================
// COMPONENTE DE REGISTRO DE PAÍSES
// ========================================
// Este componente maneja el formulario para crear y editar países

import { postCountries, patchCountries } from '../../../Apis/country/countryApi.js';

export class RegCountry extends HTMLElement {
    // Constructor del componente
    constructor() {
        super();
        this.render(); // Crear el HTML del formulario
        // Usar setTimeout para asegurar que el DOM esté listo
        setTimeout(() => {
            this.saveData();        // Configurar eventos de guardado
            window.enabledBtns();   // Activar botones
            this.disableFrm(true);  // Deshabilitar formulario inicialmente
        }, 0);
    }

    // Función que crea el HTML del formulario
    render() {
        this.innerHTML = /* html */ `
            <style rel="stylesheet">
                @import "./App/Components/countries/countryStyle.css";
            </style>
            <div class="card mt-3">
                <div class="card-header">
                    Registro de Países <span class="badge rounded-pill text-bg-primary" id="idView"></span>
                </div>
                <div class="card-body">
                    <form id="frmDataCountry">
                        <div class="row">
                            <div class="col">
                                <label for="name" class="form-label">Nombre del País <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="name" name="name">
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col">
                                <div class="container mt-4 text-center">
                                    <a href="#" class="btn btn-primary" id="btnNuevo" data-ed='[["#btnGuardar","#btnCancelar"],["#btnNuevo"]]'>Nuevo</a>
                                    <a href="#" class="btn btn-dark" id="btnCancelar" data-ed='[["#btnNuevo"],["#btnGuardar","#btnCancelar"]]'>Cancelar</a>
                                    <a href="#" class="btn btn-success" id="btnGuardar" data-ed='[["#btnCancelar","#btnNuevo"],["#btnGuardar"]]'>Guardar</a>
                                </div>
                            </div>
                        </div> 
                    </form>
                </div>
            </div>
        `;
        // Configurar evento del botón "Nuevo"
        this.querySelector("#btnNuevo").addEventListener("click", (e) => {
            window.ctrlBtn(e.target.dataset.ed); // Activar/desactivar botones
            window.resetIdView();                // Limpiar ID mostrado
            this.disableFrm(false);              // Habilitar formulario
        })
        
        // Configurar evento del botón "Cancelar"
        this.querySelector("#btnCancelar").addEventListener("click", (e) => {
            window.ctrlBtn(e.target.dataset.ed); // Activar/desactivar botones
            window.resetIdView();                // Limpiar ID mostrado
            this.disableFrm(true);               // Deshabilitar formulario
        })
    }




    // Función que configura el evento de guardado
    saveData = () => {
        const frmRegistro = document.querySelector('#frmDataCountry');
        const btnGuardar = document.querySelector('#btnGuardar');
        
        // Verificar que el botón existe
        if (!btnGuardar) {
            return;
        }
        
        // Configurar evento del botón "Guardar"
        btnGuardar.addEventListener("click", (e) => {
            try {
                e.stopImmediatePropagation();
                e.preventDefault();
                
                // Obtener datos del formulario
                const datos = Object.fromEntries(new FormData(frmRegistro).entries());
                
                // Validar que el nombre no esté vacío
                if (!datos.name || datos.name.trim() === '') {
                    alert('Complete todos los campos');
                    return;
                }
                
                // Verificar si está editando (hay un ID en el badge)
                const idView = document.querySelector('#idView');
                const currentId = idView.textContent.trim();
                
                if (currentId) {
                    // MODO EDICIÓN: Actualizar país existente
                    patchCountries(currentId, datos)
                        .then(response => {
                            if (response.ok) {
                                window.resetIdView();                    // Limpiar ID mostrado
                                this.disableFrm(true);                  // Deshabilitar formulario
                                window.ctrlBtn(document.querySelector('#btnNuevo').dataset.ed); // Activar botón Nuevo
                                window.dispatchEvent(new CustomEvent('countryUpdated', { detail: { id: currentId, datos } }));
                            } else {
                                throw new Error(`Error: ${response.status} - ${response.statusText}`);
                            }
                        })
                        .catch(error => {
                            alert('Error al actualizar: ' + error.message);
                        });
                } else {
                    // MODO CREACIÓN: Crear nuevo país
                    postCountries(datos)
                        .then(response => {
                            if (response.ok) {
                                return response.json();
                            } else {
                                throw new Error(`Error: ${response.status} - ${response.statusText}`);
                            }
                        })
                        .then(responseData => {
                            window.viewData(responseData.id);           // Mostrar ID del país creado
                            this.disableFrm(true);                      // Deshabilitar formulario
                            window.ctrlBtn(e.target.dataset.ed);        // Activar botón Nuevo
                            window.dispatchEvent(new CustomEvent('countrySaved', { detail: responseData }));
                        })
                        .catch(error => {
                            alert('Error al crear: ' + error.message);
                        });
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        })
    }


    // Función para llenar el formulario con datos de un país (modo edición)
    // Recibe: objeto country con los datos del país
    fillForm = (country) => {
        const frmRegistro = document.querySelector('#frmDataCountry');
        frmRegistro.elements['name'].value = country.name;  // Llenar campo nombre
        window.viewData(country.id);                        // Mostrar ID del país
        this.disableFrm(false);                             // Habilitar formulario
        window.ctrlBtn(document.querySelector('#btnGuardar').dataset.ed); // Activar botón Guardar
    }

    // Función para habilitar/deshabilitar el formulario
    // Recibe: estado (true para deshabilitar, false para habilitar)
    disableFrm = (estado) => {
        window.disableFrm(estado, '#frmDataCountry');
    }
}

customElements.define('reg-country', RegCountry);
