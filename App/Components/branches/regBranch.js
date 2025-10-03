// ========================================
// COMPONENTE DE REGISTRO DE SUCURSALES
// ========================================
// Este componente maneja el formulario para crear y editar sucursales

import { postBranches, patchBranches } from '../../../Apis/branch/branchApi.js';
import { getCountries } from '../../../Apis/country/countryApi.js';
import { getCompanies } from '../../../Apis/company/companyApi.js';

export class RegBranch extends HTMLElement {
    // Constructor del componente
    constructor() {
        super();
        this.render(); // Crear el HTML del formulario
        setTimeout(() => {
            this.loadCountries(); // Cargar lista de países
            this.loadCompanies(); // Cargar lista de empresas
            this.saveData();      // Configurar eventos de guardado
            window.enabledBtns(); // Activar botones
            this.disableFrm(true); // Deshabilitar formulario inicialmente
        }, 0);
    }

    render() {
        this.innerHTML = /* html */ `
            <style rel="stylesheet">
                @import "./App/Components/branches/branchStyle.css";
            </style>
            <div class="card mt-3">
                <div class="card-header">
                    Registro de Sucursales <span class="badge rounded-pill text-bg-primary" id="idView"></span>
                </div>
                <div class="card-body">
                    <form id="frmDataBranch">
                        <div class="row">
                            <div class="col">
                                <label for="numberComercial" class="form-label">Número Comercial <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="numberComercial" name="numberComercial">
                            </div>
                            <div class="col">
                                <label for="Contact_name" class="form-label">Nombre del Contacto <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="Contact_name" name="Contact_name">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <label for="Address" class="form-label">Dirección <span class="text-danger">*</span></label>
                                <textarea class="form-control" id="Address" name="Address" rows="2"></textarea>
                            </div>
                            <div class="col">
                                <label for="Phone" class="form-label">Teléfono <span class="text-danger">*</span></label>
                                <input type="tel" class="form-control" id="Phone" name="Phone">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <label for="email" class="form-label">Email <span class="text-danger">*</span></label>
                                <input type="email" class="form-control" id="email" name="email">
                            </div>
                            <div class="col">
                                <label for="countryId" class="form-label">País <span class="text-danger">*</span></label>
                                <select class="form-control" id="countryId" name="countryId">
                                    <option value="">Seleccionar país...</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <label for="companyId" class="form-label">Empresa <span class="text-danger">*</span></label>
                                <select class="form-control" id="companyId" name="companyId">
                                    <option value="">Seleccionar empresa...</option>
                                </select>
                            </div>
                            <div class="col">
                                <!-- Columna vacía para mantener el layout -->
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
        const frmRegistro = document.querySelector('#frmDataBranch');
        document.querySelector('#btnGuardar').addEventListener("click", (e) => {
            try {
                e.stopImmediatePropagation();
                e.preventDefault();
                
                const datos = Object.fromEntries(new FormData(frmRegistro).entries());
                console.log('📤 Guardando sucursal:', datos);
                
                // Validar campos obligatorios
                if (!datos.numberComercial || datos.numberComercial.trim() === '') {
                    alert('Complete todos los campos');
                    return;
                }
                
                if (!datos.Contact_name || datos.Contact_name.trim() === '') {
                    alert('Complete todos los campos');
                    return;
                }
                
                if (!datos.Address || datos.Address.trim() === '') {
                    alert('Complete todos los campos');
                    return;
                }
                
                if (!datos.Phone || datos.Phone.trim() === '') {
                    alert('Complete todos los campos');
                    return;
                }
                
                if (!datos.email || datos.email.trim() === '') {
                    alert('Complete todos los campos');
                    return;
                }
                
                if (!datos.countryId || datos.countryId.trim() === '') {
                    alert('Complete todos los campos');
                    return;
                }
                
                if (!datos.companyId || datos.companyId.trim() === '') {
                    alert('Complete todos los campos');
                    return;
                }
                
                // Verificar si está en modo edición (hay un ID en el badge)
                const idView = document.querySelector('#idView');
                const currentId = idView.textContent.trim();
                
                if (currentId) {
                    // Editar sucursal existente
                    patchBranches(currentId, datos)
                        .then(response => {
                            if (response.ok) {
                                window.resetIdView();
                                this.disableFrm(true);
                                window.ctrlBtn(document.querySelector('#btnNuevo').dataset.ed);
                                window.dispatchEvent(new CustomEvent('branchUpdated', { detail: { id: currentId, datos } }));
                            } else {
                                throw new Error(`Error: ${response.status} - ${response.statusText}`);
                            }
                        })
                        .catch(error => {
                            alert('Error al actualizar: ' + error.message);
                        });
                } else {
                    // Crear nueva sucursal
                    postBranches(datos)
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
                            window.dispatchEvent(new CustomEvent('branchSaved', { detail: responseData }));
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


    fillForm = (branch) => {
        const frmRegistro = document.querySelector('#frmDataBranch');
        frmRegistro.elements['numberComercial'].value = branch.numberComercial;
        frmRegistro.elements['Contact_name'].value = branch.Contact_name;
        frmRegistro.elements['Address'].value = branch.Address;
        frmRegistro.elements['Phone'].value = branch.Phone;
        frmRegistro.elements['email'].value = branch.email;
        frmRegistro.elements['countryId'].value = branch.countryId || '';
        frmRegistro.elements['companyId'].value = branch.companyId || '';
        window.viewData(branch.id);
        this.disableFrm(false);
        
        // Activar botones de edición (Guardar y Cancelar)
        window.ctrlBtn(document.querySelector('#btnGuardar').dataset.ed);
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

    loadCompanies = async () => {
        try {
            const companies = await getCompanies();
            const companySelect = document.querySelector('#companyId');
            
            if (companies && companies.length > 0) {
                // Limpiar opciones existentes excepto la primera
                companySelect.innerHTML = '<option value="">Seleccionar empresa...</option>';
                
                // Agregar empresas al selector
                companies.forEach(company => {
                    const option = document.createElement('option');
                    option.value = company.id;
                    option.textContent = company.name;
                    companySelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error cargando empresas:', error);
        }
    }

    disableFrm = (estado) => {
        window.disableFrm(estado, '#frmDataBranch');
    }
}

customElements.define('reg-branch', RegBranch);