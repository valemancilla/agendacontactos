import { postCountries, patchCountries, deleteCountries } from '../../../Apis/country/countryApi.js';

export class RegCountry extends HTMLElement {
    constructor() {
        super();
        this.render();
        // Usar setTimeout para asegurar que el DOM esté listo
        setTimeout(() => {
            this.saveData();
            this.enabledBtns();
            this.eventoEditar();
            this.eventoEliminar();
            this.disableFrm(true);
        }, 0);
    }

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
                                <label for="name" class="form-label">Nombre del País</label>
                                <input type="text" class="form-control" id="name" name="name">
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col">
                                <div class="container mt-4 text-center">
                                    <a href="#" class="btn btn-primary" id="btnNuevo" data-ed='[["#btnGuardar","#btnCancelar"],["#btnNuevo","#btnEditar","#btnEliminar"]]'>Nuevo</a>
                                    <a href="#" class="btn btn-dark" id="btnCancelar" data-ed='[["#btnNuevo"],["#btnGuardar","#btnEditar","#btnEliminar","#btnCancelar"]]'>Cancelar</a>
                                    <a href="#" class="btn btn-success" id="btnGuardar" data-ed='[["#btnEditar","#btnCancelar","#btnNuevo","#btnEliminar"],["#btnGuardar"]]'>Guardar</a>
                                    <a href="#" class="btn btn-warning" id="btnEditar" data-ed='[["#btnGuardar","#btnCancelar"],["#btnNuevo","#btnEliminar"]]'>Editar</a>
                                    <a href="#" class="btn btn-danger" id="btnEliminar" data-ed='[["#btnNuevo"],["#btnGuardar","#btnEditar","#btnEliminar","#btnCancelar"]]'>Eliminar</a>
                                </div>
                            </div>
                        </div> 
                    </form>
                </div>
            </div>
        `;
        this.querySelector("#btnNuevo").addEventListener("click", (e) => {
            this.ctrlBtn(e.target.dataset.ed);
            this.resetIdView();
            this.disableFrm(false);
        })
        this.querySelector("#btnCancelar").addEventListener("click", (e) => {
            this.ctrlBtn(e.target.dataset.ed);
            this.resetIdView();
            this.disableFrm(true);
        })
    }

    resetIdView = () => {
        const idView = document.querySelector('#idView');
        idView.innerHTML = '';   
    }

    eventoEditar = () => {
        document.querySelector('#btnEditar').addEventListener("click", (e) => {
            console.log('🖱️ Botón Editar clickeado');
            console.log('📋 Data-ed:', e.target.dataset.ed);
            
            // Activar botones Guardar y Cancelar, desactivar Nuevo y Eliminar
            this.ctrlBtn(e.target.dataset.ed);
            this.disableFrm(false); // Habilitar el formulario para edición
            
            console.log('✅ Botones actualizados');
            e.stopImmediatePropagation();
            e.preventDefault();        
        });
    }

    eventoEliminar = () => {
        document.querySelector('#btnEliminar').addEventListener("click", (e) => {
            this.delData();
            e.stopImmediatePropagation();
            e.preventDefault();        
        });
    }

    ctrlBtn = (e) => {
        let data = JSON.parse(e);
        console.log('🔧 Activando botones:', data[0]);
        console.log('🔧 Desactivando botones:', data[1]);
        
        data[0].forEach(boton => {
            let btnActual = document.querySelector(boton);
            if (btnActual) {
                btnActual.classList.remove('disabled');
                btnActual.removeAttribute('disabled');
                console.log('✅ Activado:', boton);
            } else {
                console.log('❌ No encontrado:', boton);
            }
        });
        data[1].forEach(boton => {
            let btnActual = document.querySelector(boton);
            if (btnActual) {
                btnActual.classList.add('disabled');
                btnActual.setAttribute('disabled', 'disabled');
                console.log('❌ Desactivado:', boton);
            } else {
                console.log('❌ No encontrado:', boton);
            }
        });
    }

    enabledBtns = () => {
        document.querySelectorAll(".btn").forEach((val, id) => {
            this.ctrlBtn(val.dataset.ed);
        })
    }


    delData = () => {
        const idView = document.querySelector('#idView');
        let id = idView.textContent;
        
        if (!id) {
            alert('No hay país seleccionado para eliminar');
            return;
        }


        deleteCountries(id)
            .then(response => {
                if (response.ok) {
                    this.resetIdView();
                    this.disableFrm(true);
                    this.ctrlBtn(document.querySelector('#btnNuevo').dataset.ed);
                    // Disparar evento para actualizar listado
                    window.dispatchEvent(new CustomEvent('countryDeleted', { detail: { id } }));
                } else {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
            })
            .catch(error => {
                console.error('Error al eliminar país:', error);
                alert('Error al eliminar el país: ' + error.message);
            });   
    }

    saveData = () => {
        const frmRegistro = document.querySelector('#frmDataCountry');
        const btnGuardar = document.querySelector('#btnGuardar');
        
        console.log('🔧 Configurando evento para botón guardar:', btnGuardar);
        
        if (!btnGuardar) {
            console.error('❌ No se encontró el botón guardar');
            return;
        }
        
        btnGuardar.addEventListener("click", (e) => {
            console.log('🖱️ Botón guardar clickeado');
            try {
                e.stopImmediatePropagation();
                e.preventDefault();
                
                const datos = Object.fromEntries(new FormData(frmRegistro).entries());
                console.log('📤 Guardando país:', datos);
                
                // Validar que el nombre no esté vacío
                if (!datos.name || datos.name.trim() === '') {
                    alert('El nombre del país es requerido');
                    return;
                }
                
                // Verificar si está en modo edición (hay un ID en el badge)
                const idView = document.querySelector('#idView');
                const currentId = idView.textContent.trim();
                
                if (currentId) {
                    // Modo edición - usar PATCH
                    console.log('📝 Modo edición - actualizando país ID:', currentId);
                    patchCountries(currentId, datos)
                        .then(response => {
                            console.log('📡 Respuesta del servidor (PATCH):', response);
                            console.log('📊 Status:', response.status);
                            console.log('📊 StatusText:', response.statusText);
                            
                            if (response.ok) {
                                this.resetIdView();
                                this.disableFrm(true);
                                this.ctrlBtn(document.querySelector('#btnNuevo').dataset.ed);
                                // Disparar evento para actualizar listado
                                window.dispatchEvent(new CustomEvent('countryUpdated', { detail: { id: currentId, datos } }));
                            } else {
                                throw new Error(`Error en la solicitud PATCH: ${response.status} - ${response.statusText}`);
                            }
                        })
                        .catch(error => {
                            console.error('Error al actualizar país:', error);
                            alert('Error al actualizar el país: ' + error.message);
                        });
                } else {
                    // Modo creación - usar POST
                    console.log('➕ Modo creación - creando nuevo país');
                    postCountries(datos)
                        .then(response => {
                            console.log('📡 Respuesta del servidor (POST):', response);
                            console.log('📊 Status:', response.status);
                            console.log('📊 StatusText:', response.statusText);
                            
                            if (response.ok) {
                                return response.json();
                            } else {
                                throw new Error(`Error en la solicitud POST: ${response.status} - ${response.statusText}`);
                            }
                        })
                        .then(responseData => {
                            console.log('País guardado exitosamente:', responseData);
                            this.viewData(responseData.id);
                            this.disableFrm(true);
                            this.ctrlBtn(e.target.dataset.ed);
                            // Disparar evento para actualizar listado
                            window.dispatchEvent(new CustomEvent('countrySaved', { detail: responseData }));
                        })
                        .catch(error => {
                            console.error('Error al crear país:', error.message);
                            alert('Error al crear el país: ' + error.message);
                        });
                }
            } catch (error) {
                console.error('Error en saveData:', error);
                alert('Error inesperado: ' + error.message);
            }
        })
    }

    viewData = (id) => {
        const idView = document.querySelector('#idView');
        idView.innerHTML = id;
    }

    fillForm = (country) => {
        const frmRegistro = document.querySelector('#frmDataCountry');
        frmRegistro.elements['name'].value = country.name;
        this.viewData(country.id);
        this.disableFrm(false);
        
        // Activar botones de edición (Guardar y Cancelar)
        const btnEditar = document.querySelector('#btnEditar');
        if (btnEditar) {
            this.ctrlBtn(btnEditar.dataset.ed);
        }
    }

    disableFrm = (estado) => {
        const frmRegistro = document.querySelector('#frmDataCountry');
        frmRegistro.elements['name'].value = '';
        frmRegistro.elements['name'].disabled = estado;
    }
}

customElements.define('reg-country', RegCountry);
