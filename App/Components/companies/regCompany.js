import { postCompanies, patchCompanies, deleteCompanies } from '../../../Apis/company/companyApi.js';
import { getCountries } from '../../../Apis/country/countryApi.js';

export class RegCompany extends HTMLElement {
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
                                <label for="name" class="form-label">Nombre de la Empresa</label>
                                <input type="text" class="form-control" id="name" name="name">
                            </div>
                            <div class="col">
                                <label for="UKNiu" class="form-label">UKNiu</label>
                                <input type="text" class="form-control" id="UKNiu" name="UKNiu">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <label for="address" class="form-label">Dirección</label>
                                <textarea class="form-control" id="address" name="address" rows="2"></textarea>
                            </div>
                            <div class="col">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="email" name="email">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <label for="countryId" class="form-label">País</label>
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
                                    <a href="#" class="btn btn-primary" id="btnNuevo" data-ed='[["#btnGuardar","#btnCancelar"],["#btnNuevo","#btnEditar","#btnEliminar"]]'>Nuevo</a>
                                    <a href="#" class="btn btn-dark" id="btnCancelar" data-ed='[["#btnNuevo"],["#btnGuardar","#btnEditar","#btnEliminar","#btnCancelar"]]'>Cancelar</a>
                                    <a href="#" class="btn btn-success" id="btnGuardar" data-ed='[["#btnEditar","#btnCancelar","#btnNuevo","#btnEliminar"],["#btnGuardar"]]'>Guardar</a>
                                    <a href="#" class="btn btn-warning" id="btnEditar" data-ed='[[],[]]'>Editar</a>
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
            this.editData();
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
        });
        data[1].forEach(boton => {
            let btnActual = document.querySelector(boton);
            btnActual.classList.add('disabled');
        });
    }

    enabledBtns = () => {
        document.querySelectorAll(".btn").forEach((val, id) => {
            this.ctrlBtn(val.dataset.ed);
        })
    }

    editData = () => {
        const frmRegistro = document.querySelector('#frmDataCompany');
        const datos = Object.fromEntries(new FormData(frmRegistro).entries());
        const idView = document.querySelector('#idView');
        let id = idView.textContent;
        
        if (!id) {
            alert('No hay empresa seleccionada para editar');
            return;
        }

        console.log('📤 Datos a actualizar:', datos);
        patchCompanies(id, datos)
            .then(response => {
                if (response.ok) {
                    this.resetIdView();
                    this.disableFrm(true);
                    this.ctrlBtn(document.querySelector('#btnNuevo').dataset.ed);
                    // Disparar evento para actualizar listado
                    window.dispatchEvent(new CustomEvent('companyUpdated', { detail: { id, datos } }));
                } else {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
            })
            .catch(error => {
                console.error('Error al actualizar empresa:', error);
                alert('Error al actualizar la empresa');
            });
    }

    delData = () => {
        const idView = document.querySelector('#idView');
        let id = idView.textContent;
        
        if (!id) {
            alert('No hay empresa seleccionada para eliminar');
            return;
        }


        deleteCompanies(id)
            .then(response => {
                if (response.ok) {
                    this.resetIdView();
                    this.disableFrm(true);
                    this.ctrlBtn(document.querySelector('#btnNuevo').dataset.ed);
                    // Disparar evento para actualizar listado
                    window.dispatchEvent(new CustomEvent('companyDeleted', { detail: { id } }));
                } else {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
            })
            .catch(error => {
                console.error('Error al eliminar empresa:', error);
                alert('Error al eliminar la empresa');
            });   
    }

    saveData = () => {
        const frmRegistro = document.querySelector('#frmDataCompany');
        document.querySelector('#btnGuardar').addEventListener("click", (e) => {
            try {
                e.stopImmediatePropagation();
                e.preventDefault();
                
                const datos = Object.fromEntries(new FormData(frmRegistro).entries());
                console.log('📤 Datos a enviar:', datos);
                
                postCompanies(datos)
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            throw new Error(`Error en la solicitud POST: ${response.status} - ${response.statusText}`);
                        }
                    })
                    .then(responseData => {
                        console.log('Empresa guardada exitosamente:', responseData);
                        this.viewData(responseData.id);
                        this.disableFrm(true);
                        this.ctrlBtn(e.target.dataset.ed);
                        // Disparar evento para actualizar listado
                        window.dispatchEvent(new CustomEvent('companySaved', { detail: responseData }));
                    })
                    .catch(error => {
                        console.error('Error al crear empresa:', error.message);
                        alert('Error al crear la empresa: ' + error.message);
                    });
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

    fillForm = (company) => {
        const frmRegistro = document.querySelector('#frmDataCompany');
        frmRegistro.elements['name'].value = company.name;
        frmRegistro.elements['UKNiu'].value = company.UKNiu;
        frmRegistro.elements['address'].value = company.address;
        frmRegistro.elements['email'].value = company.email;
        frmRegistro.elements['countryId'].value = company.countryId || '';
        this.viewData(company.id);
        this.disableFrm(false);
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
        const frmRegistro = document.querySelector('#frmDataCompany');
        frmRegistro.elements['name'].value = '';
        frmRegistro.elements['UKNiu'].value = '';
        frmRegistro.elements['address'].value = '';
        frmRegistro.elements['email'].value = '';
        frmRegistro.elements['countryId'].value = '';
        frmRegistro.elements['name'].disabled = estado;
        frmRegistro.elements['UKNiu'].disabled = estado;
        frmRegistro.elements['address'].disabled = estado;
        frmRegistro.elements['email'].disabled = estado;
        frmRegistro.elements['countryId'].disabled = estado;
    }

}

customElements.define('reg-company', RegCompany);
