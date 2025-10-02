import { postCities, patchCities, deleteCities } from '../../../Apis/city/cityApi.js';
import { getRegions } from '../../../Apis/region/regionApi.js';

export class RegCity extends HTMLElement {
    constructor() {
        super();
        this.render();
        // Usar setTimeout para asegurar que el DOM esté listo
        setTimeout(() => {
            this.loadRegions();
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
                @import "./App/Components/cities/cityStyle.css";
            </style>
            <div class="card mt-3">
                <div class="card-header">
                    Registro de Ciudades <span class="badge rounded-pill text-bg-primary" id="idView"></span>
                </div>
                <div class="card-body">
                    <form id="frmDataCity">
                        <div class="row">
                            <div class="col">
                                <label for="name" class="form-label">Nombre de la Ciudad</label>
                                <input type="text" class="form-control" id="name" name="name">
                            </div>
                            <div class="col">
                                <label for="regionId" class="form-label">Región</label>
                                <select class="form-control" id="regionId" name="regionId">
                                    <option value="">Seleccionar región...</option>
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
        const frmRegistro = document.querySelector('#frmDataCity');
        const datos = Object.fromEntries(new FormData(frmRegistro).entries());
        const idView = document.querySelector('#idView');
        let id = idView.textContent;
        
        if (!id) {
            alert('No hay ciudad seleccionada para editar');
            return;
        }

        patchCities(id, datos)
            .then(response => {
                if (response.ok) {
                    this.resetIdView();
                    this.disableFrm(true);
                    this.ctrlBtn(document.querySelector('#btnNuevo').dataset.ed);
                    // Disparar evento para actualizar listado
                    window.dispatchEvent(new CustomEvent('cityUpdated', { detail: { id, datos } }));
                } else {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
            })
            .catch(error => {
                console.error('Error al actualizar ciudad:', error);
                alert('Error al actualizar la ciudad');
            });
    }

    delData = () => {
        const idView = document.querySelector('#idView');
        let id = idView.textContent;
        
        if (!id) {
            alert('No hay ciudad seleccionada para eliminar');
            return;
        }


        deleteCities(id)
            .then(response => {
                if (response.ok) {
                    this.resetIdView();
                    this.disableFrm(true);
                    this.ctrlBtn(document.querySelector('#btnNuevo').dataset.ed);
                    // Disparar evento para actualizar listado
                    window.dispatchEvent(new CustomEvent('cityDeleted', { detail: { id } }));
                } else {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
            })
            .catch(error => {
                console.error('Error al eliminar ciudad:', error);
                alert('Error al eliminar la ciudad');
            });   
    }

    saveData = () => {
        const frmRegistro = document.querySelector('#frmDataCity');
        document.querySelector('#btnGuardar').addEventListener("click", (e) => {
            try {
                e.stopImmediatePropagation();
                e.preventDefault();
                
                const datos = Object.fromEntries(new FormData(frmRegistro).entries());
                console.log('📤 Guardando ciudad:', datos);
                
                // Validar que el nombre no esté vacío
                if (!datos.name || datos.name.trim() === '') {
                    alert('El nombre de la ciudad es requerido');
                    return;
                }
                
                // Verificar si está en modo edición (hay un ID en el badge)
                const idView = document.querySelector('#idView');
                const currentId = idView.textContent.trim();
                
                if (currentId) {
                    // Modo edición - usar PATCH
                    console.log('📝 Modo edición - actualizando ciudad ID:', currentId);
                    patchCities(currentId, datos)
                        .then(response => {
                            console.log('📡 Respuesta del servidor (PATCH):', response);
                            console.log('📊 Status:', response.status);
                            console.log('📊 StatusText:', response.statusText);
                            
                            if (response.ok) {
                                this.resetIdView();
                                this.disableFrm(true);
                                this.ctrlBtn(document.querySelector('#btnNuevo').dataset.ed);
                                // Disparar evento para actualizar listado
                                window.dispatchEvent(new CustomEvent('cityUpdated', { detail: { id: currentId, datos } }));
                            } else {
                                throw new Error(`Error en la solicitud PATCH: ${response.status} - ${response.statusText}`);
                            }
                        })
                        .catch(error => {
                            console.error('Error al actualizar ciudad:', error);
                            alert('Error al actualizar la ciudad: ' + error.message);
                        });
                } else {
                    // Modo creación - usar POST
                    console.log('➕ Modo creación - creando nueva ciudad');
                    postCities(datos)
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
                            console.log('Ciudad guardada exitosamente:', responseData);
                            this.viewData(responseData.id);
                            this.disableFrm(true);
                            this.ctrlBtn(e.target.dataset.ed);
                            // Disparar evento para actualizar listado
                            window.dispatchEvent(new CustomEvent('citySaved', { detail: responseData }));
                        })
                        .catch(error => {
                            console.error('Error al crear ciudad:', error.message);
                            alert('Error al crear la ciudad: ' + error.message);
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

    fillForm = (city) => {
        const frmRegistro = document.querySelector('#frmDataCity');
        frmRegistro.elements['name'].value = city.name;
        frmRegistro.elements['regionId'].value = city.regionId || '';
        this.viewData(city.id);
        this.disableFrm(false);
        
        // Activar botones de edición (Guardar y Cancelar)
        const btnEditar = document.querySelector('#btnEditar');
        if (btnEditar) {
            this.ctrlBtn(btnEditar.dataset.ed);
        }
    }

    loadRegions = async () => {
        try {
            const regions = await getRegions();
            const regionSelect = document.querySelector('#regionId');
            
            if (regions && regions.length > 0) {
                // Limpiar opciones existentes excepto la primera
                regionSelect.innerHTML = '<option value="">Seleccionar región...</option>';
                
                // Agregar regiones al selector
                regions.forEach(region => {
                    const option = document.createElement('option');
                    option.value = region.id;
                    option.textContent = region.name;
                    regionSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error cargando regiones:', error);
        }
    }

    disableFrm = (estado) => {
        const frmRegistro = document.querySelector('#frmDataCity');
        frmRegistro.elements['name'].value = '';
        frmRegistro.elements['regionId'].value = '';
        frmRegistro.elements['name'].disabled = estado;
        frmRegistro.elements['regionId'].disabled = estado;
    }
}

customElements.define('reg-city', RegCity);
