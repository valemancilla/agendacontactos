// ========================================
// COMPONENTE DE REGISTRO DE EMPRESAS
// ========================================
// Este componente maneja el formulario para crear y editar empresas

import { postCompanies, patchCompanies } from '../../../Apis/company/companyApi.js';
import { getCountries } from '../../../Apis/country/countryApi.js';

export class RegCompany extends HTMLElement {
    // Constructor del componente
    constructor() {
        super();
        this.render(); // Crear el HTML del formulario
        // Usar setTimeout para asegurar que el DOM esté listo
        setTimeout(() => {
            this.loadCountries(); // Cargar lista de países
            this.saveData();      // Configurar eventos de guardado
            window.enabledBtns(); // Activar botones
            this.disableFrm(true); // Deshabilitar formulario inicialmente
        }, 0);
    }

    render() {
        this.innerHTML = /* html */ `
            <style rel="stylesheet">
                @import "./App/Components/companies/companyStyle.css";
            </style>
            <div class="card mt-3">
                <div class="card-header">
                    Registro de Empresas <span class="badge rounded-pill text-bg-primary" id="idView"></span>
                </div>
                <div class="card-body">
                    <form id="frmDataCompany">
                        <div class="row">
                            <div class="col">
                                <label for="name" class="form-label">Nombre de la Empresa <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="name" name="name">
                            </div>
                            <div class="col">
                                <label for="UKNiu" class="form-label">UKNiu <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="UKNiu" name="UKNiu">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <label for="address" class="form-label">Dirección <span class="text-danger">*</span></label>
                                <textarea class="form-control" id="address" name="address" rows="2"></textarea>
                            </div>
                            <div class="col">
                                <label for="email" class="form-label">Email <span class="text-danger">*</span></label>
                                <input type="email" class="form-control" id="email" name="email">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <label for="countryId" class="form-label">País <span class="text-danger">*</span></label>
                                <select class="form-control" id="countryId" name="countryId">
                                    <option value="">Seleccionar país...</option>
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
        const frmRegistro = document.querySelector('#frmDataCompany');
        document.querySelector('#btnGuardar').addEventListener("click", (e) => {
            try {
                e.stopImmediatePropagation();
                e.preventDefault();
                
                const datos = Object.fromEntries(new FormData(frmRegistro).entries());
                console.log('📤 Guardando empresa:', datos);
                
                // Validar campos obligatorios
                if (!datos.name || datos.name.trim() === '') {
                    alert('Complete todos los campos');
                    return;
                }
                
                if (!datos.UKNiu || datos.UKNiu.trim() === '') {
                    alert('Complete todos los campos');
                    return;
                }
                
                if (!datos.address || datos.address.trim() === '') {
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
                
                // Verificar si está en modo edición (hay un ID en el badge)
                const idView = document.querySelector('#idView');
                const currentId = idView.textContent.trim();
                
                if (currentId) {
                    // Editar empresa existente
                    patchCompanies(currentId, datos)
                        .then(response => {
                            if (response.ok) {
                                window.resetIdView();
                                this.disableFrm(true);
                                window.ctrlBtn(document.querySelector('#btnNuevo').dataset.ed);
                                window.dispatchEvent(new CustomEvent('companyUpdated', { detail: { id: currentId, datos } }));
                            } else {
                                throw new Error(`Error: ${response.status} - ${response.statusText}`);
                            }
                        })
                        .catch(error => {
                            alert('Error al actualizar: ' + error.message);
                        });
                } else {
                    // Crear nueva empresa
                    postCompanies(datos)
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
                            window.dispatchEvent(new CustomEvent('companySaved', { detail: responseData }));
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


    fillForm = (company) => {
        const frmRegistro = document.querySelector('#frmDataCompany');
        frmRegistro.elements['name'].value = company.name;
        frmRegistro.elements['UKNiu'].value = company.UKNiu;
        frmRegistro.elements['address'].value = company.address;
        frmRegistro.elements['email'].value = company.email;
        frmRegistro.elements['countryId'].value = company.countryId || '';
        window.viewData(company.id);
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

    disableFrm = (estado) => {
        window.disableFrm(estado, '#frmDataCompany');
    }

}

customElements.define('reg-company', RegCompany);
