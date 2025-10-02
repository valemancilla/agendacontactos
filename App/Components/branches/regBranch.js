import { postBranches, patchBranches, deleteBranches } from '../../../Apis/branch/branchApi.js';

export class RegBranch extends HTMLElement {
    constructor() {
        super();
        this.render();
        this.saveData();
        this.enabledBtns();
        this.eventoEditar();
        this.eventoEliminar();
        this.disableFrm(true);
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
                                <label for="numberComercial" class="form-label">Número Comercial</label>
                                <input type="text" class="form-control" id="numberComercial" name="numberComercial">
                            </div>
                            <div class="col">
                                <label for="Contact_name" class="form-label">Nombre del Contacto</label>
                                <input type="text" class="form-control" id="Contact_name" name="Contact_name">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <label for="Address" class="form-label">Dirección</label>
                                <textarea class="form-control" id="Address" name="Address" rows="2"></textarea>
                            </div>
                            <div class="col">
                                <label for="Phone" class="form-label">Teléfono</label>
                                <input type="tel" class="form-control" id="Phone" name="Phone">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="email" name="email">
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
        const frmRegistro = document.querySelector('#frmDataBranch');
        const datos = Object.fromEntries(new FormData(frmRegistro).entries());
        const idView = document.querySelector('#idView');
        let id = idView.textContent;
        
        if (!id) {
            alert('No hay sucursal seleccionada para editar');
            return;
        }

        patchBranches(id, datos)
            .then(response => {
                if (response.ok) {
                    this.resetIdView();
                    this.disableFrm(true);
                    this.ctrlBtn(document.querySelector('#btnNuevo').dataset.ed);
                } else {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
            })
            .catch(error => {
                console.error('Error al actualizar sucursal:', error);
                alert('Error al actualizar la sucursal');
            });
    }

    delData = () => {
        const idView = document.querySelector('#idView');
        let id = idView.textContent;
        
        if (!id) {
            alert('No hay sucursal seleccionada para eliminar');
            return;
        }


        deleteBranches(id)
            .then(response => {
                if (response.ok) {
                    this.resetIdView();
                    this.disableFrm(true);
                    this.ctrlBtn(document.querySelector('#btnNuevo').dataset.ed);
                } else {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
            })
            .catch(error => {
                console.error('Error al eliminar sucursal:', error);
                alert('Error al eliminar la sucursal');
            });   
    }

    saveData = () => {
        const frmRegistro = document.querySelector('#frmDataBranch');
        document.querySelector('#btnGuardar').addEventListener("click", (e) => {
            const datos = Object.fromEntries(new FormData(frmRegistro).entries());
            postBranches(datos)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error(`Error en la solicitud POST: ${response.status} - ${response.statusText}`);
                    }
                })
                .then(responseData => {
                    this.viewData(responseData.id);
                })
                .catch(error => {
                    console.error('Error al crear sucursal:', error.message);
                });
            this.ctrlBtn(e.target.dataset.ed);
            e.stopImmediatePropagation();
            e.preventDefault();
        })
    }

    viewData = (id) => {
        const idView = document.querySelector('#idView');
        idView.innerHTML = id;
    }

    fillForm = (branch) => {
        const frmRegistro = document.querySelector('#frmDataBranch');
        frmRegistro.elements['numberComercial'].value = branch.numberComercial;
        frmRegistro.elements['Contact_name'].value = branch.Contact_name;
        frmRegistro.elements['Address'].value = branch.Address;
        frmRegistro.elements['Phone'].value = branch.Phone;
        frmRegistro.elements['email'].value = branch.email;
        this.viewData(branch.id);
        this.disableFrm(false);
    }

    disableFrm = (estado) => {
        const frmRegistro = document.querySelector('#frmDataBranch');
        frmRegistro.elements['numberComercial'].value = '';
        frmRegistro.elements['Contact_name'].value = '';
        frmRegistro.elements['Address'].value = '';
        frmRegistro.elements['Phone'].value = '';
        frmRegistro.elements['email'].value = '';
        frmRegistro.elements['numberComercial'].disabled = estado;
        frmRegistro.elements['Contact_name'].disabled = estado;
        frmRegistro.elements['Address'].disabled = estado;
        frmRegistro.elements['Phone'].disabled = estado;
        frmRegistro.elements['email'].disabled = estado;
    }
}

customElements.define('reg-branch', RegBranch);