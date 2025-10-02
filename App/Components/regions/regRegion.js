import { postRegions, patchRegions, deleteRegions } from '../../../Apis/region/regionApi.js';
import { getCountries } from '../../../Apis/country/countryApi.js';

export class RegRegion extends HTMLElement {
    constructor() {
        super();
        this.render();
        // Usar setTimeout para asegurar que el DOM esté listo
        setTimeout(() => {
            this.loadCountries();
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
                @import "./App/Components/regions/regionStyle.css";
            </style>
            <div class="card mt-3">
                <div class="card-header">
                    Registro de Regiones <span class="badge rounded-pill text-bg-primary" id="idView"></span>
                </div>
                <div class="card-body">
                    <form id="frmDataRegion">
                        <div class="row">
                            <div class="col">
                                <label for="name" class="form-label">Nombre de la Región</label>
                                <input type="text" class="form-control" id="name" name="name">
                            </div>
                            <div class="col">
                                <label for="countryId" class="form-label">País</label>
                                <select class="form-control" id="countryId" name="countryId">
                                    <option value="">Seleccionar país...</option>
                                </select>
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
            // Activar botones Guardar y Cancelar, desactivar Nuevo y Eliminar
            this.ctrlBtn(e.target.dataset.ed);
            this.disableFrm(false); // Habilitar el formulario para edición
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
        data[0].forEach(boton => {
            let btnActual = document.querySelector(boton);
            btnActual.classList.remove('disabled');
            btnActual.removeAttribute('disabled');
        });
        data[1].forEach(boton => {
            let btnActual = document.querySelector(boton);
            btnActual.classList.add('disabled');
            btnActual.setAttribute('disabled', 'disabled');
        });
    }

    enabledBtns = () => {
        document.querySelectorAll(".btn").forEach((val, id) => {
            this.ctrlBtn(val.dataset.ed);
        })
    }

    editData = () => {
        const frmRegistro = document.querySelector('#frmDataRegion');
        const datos = Object.fromEntries(new FormData(frmRegistro).entries());
        const idView = document.querySelector('#idView');
        let id = idView.textContent;
        
        if (!id) {
            alert('No hay región seleccionada para editar');
            return;
        }

        patchRegions(id, datos)
            .then(response => {
                if (response.ok) {
                    this.resetIdView();
                    this.disableFrm(true);
                    this.ctrlBtn(document.querySelector('#btnNuevo').dataset.ed);
                    // Disparar evento para actualizar listado
                    window.dispatchEvent(new CustomEvent('regionUpdated', { detail: { id, datos } }));
                } else {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
            })
            .catch(error => {
                console.error('Error al actualizar región:', error);
                alert('Error al actualizar la región');
            });
    }

    delData = () => {
        const idView = document.querySelector('#idView');
        let id = idView.textContent;
        
        if (!id) {
            alert('No hay región seleccionada para eliminar');
            return;
        }


        deleteRegions(id)
            .then(response => {
                if (response.ok) {
                    this.resetIdView();
                    this.disableFrm(true);
                    this.ctrlBtn(document.querySelector('#btnNuevo').dataset.ed);
                    // Disparar evento para actualizar listado
                    window.dispatchEvent(new CustomEvent('regionDeleted', { detail: { id } }));
                } else {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
            })
            .catch(error => {
                console.error('Error al eliminar región:', error);
                alert('Error al eliminar la región');
            });   
    }

    saveData = () => {
        const frmRegistro = document.querySelector('#frmDataRegion');
        document.querySelector('#btnGuardar').addEventListener("click", (e) => {
            try {
                e.stopImmediatePropagation();
                e.preventDefault();
                
                const datos = Object.fromEntries(new FormData(frmRegistro).entries());
                console.log('📤 Guardando región:', datos);
                
                // Validar que el nombre no esté vacío
                if (!datos.name || datos.name.trim() === '') {
                    alert('El nombre de la región es requerido');
                    return;
                }
                
                // Verificar si está en modo edición (hay un ID en el badge)
                const idView = document.querySelector('#idView');
                const currentId = idView.textContent.trim();
                
                if (currentId) {
                    // Modo edición - usar PATCH
                    console.log('📝 Modo edición - actualizando región ID:', currentId);
                    patchRegions(currentId, datos)
                        .then(response => {
                            console.log('📡 Respuesta del servidor (PATCH):', response);
                            console.log('📊 Status:', response.status);
                            console.log('📊 StatusText:', response.statusText);
                            
                            if (response.ok) {
                                this.resetIdView();
                                this.disableFrm(true);
                                this.ctrlBtn(document.querySelector('#btnNuevo').dataset.ed);
                                // Disparar evento para actualizar listado
                                window.dispatchEvent(new CustomEvent('regionUpdated', { detail: { id: currentId, datos } }));
                            } else {
                                throw new Error(`Error en la solicitud PATCH: ${response.status} - ${response.statusText}`);
                            }
                        })
                        .catch(error => {
                            console.error('Error al actualizar región:', error);
                            alert('Error al actualizar la región: ' + error.message);
                        });
                } else {
                    // Modo creación - usar POST
                    console.log('➕ Modo creación - creando nueva región');
                    postRegions(datos)
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
                            console.log('Región guardada exitosamente:', responseData);
                            this.viewData(responseData.id);
                            this.disableFrm(true);
                            this.ctrlBtn(e.target.dataset.ed);
                            // Disparar evento para actualizar listado
                            window.dispatchEvent(new CustomEvent('regionSaved', { detail: responseData }));
                        })
                        .catch(error => {
                            console.error('Error al crear región:', error.message);
                            alert('Error al crear la región: ' + error.message);
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

    fillForm = (region) => {
        const frmRegistro = document.querySelector('#frmDataRegion');
        frmRegistro.elements['name'].value = region.name;
        frmRegistro.elements['countryId'].value = region.countryId || '';
        this.viewData(region.id);
        this.disableFrm(false);
        
        // Activar botones de edición (Guardar y Cancelar)
        const btnEditar = document.querySelector('#btnEditar');
        if (btnEditar) {
            this.ctrlBtn(btnEditar.dataset.ed);
        }
    }

    loadCountries = async () => {
        try {
            const countries = await getCountries();
            const countrySelect = document.querySelector('#countryId');
            
            if (countries && countries.length > 0) {
                // Limpiar opciones existentes excepto la primera
                countrySelect.innerHTML = '<option value="">Seleccionar país...</option>';
                
                // Agregar países al selector
                countries.forEach(country => {
                    const option = document.createElement('option');
                    option.value = country.id;
                    option.textContent = country.name;
                    countrySelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error cargando países:', error);
        }
    }

    disableFrm = (estado) => {
        const frmRegistro = document.querySelector('#frmDataRegion');
        frmRegistro.elements['name'].value = '';
        frmRegistro.elements['countryId'].value = '';
        frmRegistro.elements['name'].disabled = estado;
        frmRegistro.elements['countryId'].disabled = estado;
    }
}

customElements.define('reg-region', RegRegion);
