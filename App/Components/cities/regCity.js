// ========================================
// COMPONENTE DE REGISTRO DE CIUDADES
// ========================================
// Este componente maneja el formulario para crear y editar ciudades

import { postCities, patchCities } from '../../../Apis/city/cityApi.js';
import { getRegions } from '../../../Apis/region/regionApi.js';

export class RegCity extends HTMLElement {
    // Constructor del componente
    constructor() {
        super();
        this.render(); // Crear el HTML del formulario
        // Usar setTimeout para asegurar que el DOM esté listo
        setTimeout(() => {
            this.loadRegions();  // Cargar lista de regiones
            this.saveData();     // Configurar eventos de guardado
            window.enabledBtns(); // Activar botones
            this.disableFrm(true); // Deshabilitar formulario inicialmente
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
                                <label for="name" class="form-label">Nombre de la Ciudad <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="name" name="name">
                            </div>
                            <div class="col">
                                <label for="regionId" class="form-label">Región <span class="text-danger">*</span></label>
                                <select class="form-control" id="regionId" name="regionId">
                                    <option value="">Seleccionar región...</option>
                                </select>
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
        this.querySelector("#btnNuevo").addEventListener("click", (e) => {
            window.ctrlBtn(e.target.dataset.ed);
            window.resetIdView();
            this.disableFrm(false);
        })
        this.querySelector("#btnCancelar").addEventListener("click", (e) => {
            window.ctrlBtn(e.target.dataset.ed);
            window.resetIdView();
            this.disableFrm(true);
        })
    }



    saveData = () => {
        const frmRegistro = document.querySelector('#frmDataCity');
        document.querySelector('#btnGuardar').addEventListener("click", (e) => {
            try {
                e.stopImmediatePropagation();
                e.preventDefault();
                
                const datos = Object.fromEntries(new FormData(frmRegistro).entries());
                console.log('📤 Guardando ciudad:', datos);
                
                // Validar campos obligatorios
                if (!datos.name || datos.name.trim() === '') {
                    alert('Complete todos los campos');
                    return;
                }
                
                if (!datos.regionId || datos.regionId.trim() === '') {
                    alert('Complete todos los campos');
                    return;
                }
                
                // Verificar si está en modo edición (hay un ID en el badge)
                const idView = document.querySelector('#idView');
                const currentId = idView.textContent.trim();
                
                if (currentId) {
                    // Editar ciudad existente
                    patchCities(currentId, datos)
                        .then(response => {
                            if (response.ok) {
                                window.resetIdView();
                                this.disableFrm(true);
                                window.ctrlBtn(document.querySelector('#btnNuevo').dataset.ed);
                                window.dispatchEvent(new CustomEvent('cityUpdated', { detail: { id: currentId, datos } }));
                            } else {
                                throw new Error(`Error: ${response.status} - ${response.statusText}`);
                            }
                        })
                        .catch(error => {
                            alert('Error al actualizar: ' + error.message);
                        });
                } else {
                    // Crear nueva ciudad
                    postCities(datos)
                        .then(response => {
                            if (response.ok) {
                                return response.json();
                            } else {
                                throw new Error(`Error: ${response.status} - ${response.statusText}`);
                            }
                        })
                        .then(responseData => {
                            window.viewData(responseData.id);
                            this.disableFrm(true);
                            window.ctrlBtn(e.target.dataset.ed);
                            window.dispatchEvent(new CustomEvent('citySaved', { detail: responseData }));
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


    fillForm = (city) => {
        const frmRegistro = document.querySelector('#frmDataCity');
        frmRegistro.elements['name'].value = city.name;
        frmRegistro.elements['regionId'].value = city.regionId || '';
        window.viewData(city.id);
        this.disableFrm(false);
        
        // Activar botones de edición (Guardar y Cancelar)
        window.ctrlBtn(document.querySelector('#btnGuardar').dataset.ed);
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
        window.disableFrm(estado, '#frmDataCity');
    }
}

customElements.define('reg-city', RegCity);
