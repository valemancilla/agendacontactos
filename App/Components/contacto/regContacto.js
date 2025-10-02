import {postContacts,patchContacts,deleteContacts} from '../../../Apis/contact/contactApi.js';
import ContactModel from '../../../Models/contactModel.js';
export class RegContacto extends HTMLElement {
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
        @import "./App/Components/contacto/contactoStyle.css";
      </style>
        <div class="card mt-3">
            <div class="card-header">
                Registro de Contactos <span class="badge rounded-pill text-bg-primary" id="idView"></span>
            </div>
            <div class="card-body">
                <form id="frmDataContacto">
                    <div class="row">
                        <div class="col">
                            <label for="nombreContacto" class="form-label">Nombre Contacto</label>
                            <input type="text" class="form-control" id="nombreContacto" name ="nombreContacto">
                        </div>
                        <div class="col">
                            <label for="apellidoContacto" class="form-label">Apellidos Contacto</label>
                            <input type="text" class="form-control" id="apellidoContacto" name="apellidoContacto">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <label for="nroCelular" class="form-label">Nro Celular</label>
                            <input type="text" class="form-control" id="nroCelular" name ="nroCelular">
                        </div>
                        <div class="col">
                            <label for="emailContacto" class="form-label">Email</label>
                            <input type="text" class="form-control" id="emailContacto" name="emailContacto">
                        </div>
                        <div class="col">
                            <label for="nroResidencia" class="form-label">Nro Residencia</label>
                            <input type="text" class="form-control" id="nroResidencia" name="nroResidencia">
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col">
                            <div class="container mt-4 text-center">
                                <a href="#" class="btn btn-primary"  id="btnNuevo" data-ed='[["#btnGuardar","#btnCancelar"],["#btnNuevo","#btnEditar","#btnEliminar"]]'>Nuevo</a>
                                <a href="#" class="btn btn-dark " id="btnCancelar" data-ed='[["#btnNuevo"],["#btnGuardar","#btnEditar","#btnEliminar","#btnCancelar"]]'>Cancelar</a>
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
      this.querySelector("#btnNuevo").addEventListener("click",(e) =>{
        this.ctrlBtn(e.target.dataset.ed);
        this.resetIdView();
        this.disableFrm(false);
      })
      this.querySelector("#btnCancelar").addEventListener("click",(e) =>{
        this.ctrlBtn(e.target.dataset.ed);
        this.resetIdView();
        this.disableFrm(true);
      })
  }
resetIdView =() =>{
    const idView = document.querySelector('#idView');
    idView.innerHTML = '';   
}

recargarLista = () => {
    // Recargar la lista de contactos
    const lstComponent = document.querySelector('lst-contacto');
    if (lstComponent) {
        lstComponent.loadContacts();
    }
}
eventoEditar =() =>{
    document.querySelector('#btnEditar').addEventListener("click",(e) =>{
        this.editData();
        e.stopImmediatePropagation();
        e.preventDefault();        
    });
}
eventoEliminar =() =>{
    document.querySelector('#btnEliminar').addEventListener("click",(e) =>{
        this.delData();
        e.stopImmediatePropagation();
        e.preventDefault();        
    });
}
ctrlBtn = (e) =>{
    console.log('🔧 ctrlBtn ejecutado con:', e);
    let data = JSON.parse(e);
    console.log('🔧 Datos parseados:', data);
    
    data[0].forEach(boton => {
        let btnActual = document.querySelector(boton);
        if (btnActual) {
            btnActual.disabled = false;
            btnActual.classList.remove('disabled');
            console.log('✅ Habilitado:', boton);
        }
    });
    data[1].forEach(boton => {
        let btnActual = document.querySelector(boton);
        if (btnActual) {
            btnActual.disabled = true;
            btnActual.classList.add('disabled');
            console.log('❌ Deshabilitado:', boton);
        }
    });
}
enabledBtns =() =>{
    document.querySelectorAll(".btn").forEach((val, id) => {
        this.ctrlBtn(val.dataset.ed);
    })
}
editData = () =>{
    console.log('🔥 MÉTODO editData EJECUTADO');
    
    const frmRegistro = document.querySelector('#frmDataContacto');
    const datos = Object.fromEntries(new FormData(frmRegistro).entries());
    const idView = document.querySelector('#idView');
    let id = idView.textContent;
    
    console.log('=== INICIANDO EDICIÓN ===');
    console.log('ID del contacto:', id);
    console.log('Formulario:', frmRegistro);
    console.log('Datos del formulario:', datos);
    console.log('Elementos del formulario:', frmRegistro.elements);
    
    // Verificar que el ID no esté vacío
    if (!id || id.trim() === '') {
        console.error('ERROR: No hay ID para editar');
        return;
    }
    
    patchContacts(datos,id)
    .then(response => {
        // Verificar si la solicitud fue exitosa (código de respuesta en el rango 200)
        if (response.ok) {
            return response.json(); // Devolver la respuesta como JSON
        } else {
            // Si la respuesta no fue exitosa, lanzar una excepción
            throw new Error(`Error en la solicitud PATCH: ${response.status} - ${response.statusText}`);
        }
    })
    .then(responseData => {
        console.log('Contacto actualizado exitosamente:', responseData);
        // Limpiar el formulario
        this.resetIdView();
        this.disableFrm(true);
        // Cambiar botones a estado inicial
        this.ctrlBtn('[["#btnNuevo"],["#btnGuardar","#btnCancelar","#btnEditar","#btnEliminar"]]');
        // Recargar la lista de contactos
        this.recargarLista();
    })
    .catch(error => {
        console.error('Error en la solicitud PATCH:', error.message);
    });
}
delData = () =>{
    console.log('🔥 MÉTODO delData EJECUTADO');
    
    const idView = document.querySelector('#idView');
    let id = idView.textContent;
    
    console.log('Eliminando contacto con ID:', id);
    
    // Verificar que el ID no esté vacío
    if (!id || id.trim() === '') {
        console.error('ERROR: No hay ID para eliminar');
        return;
    }
    
    deleteContacts(id)
    .then(response => {
        // Verificar si la solicitud fue exitosa (código de respuesta en el rango 200)
        if (response.ok) {
            return response.json(); // Devolver la respuesta como JSON
        } else {
            // Si la respuesta no fue exitosa, lanzar una excepción
            throw new Error(`Error en la solicitud DELETE: ${response.status} - ${response.statusText}`);
        }
    })
    .then(responseData => {
        console.log('Contacto eliminado exitosamente:', responseData);
        this.resetIdView();
        this.disableFrm(true);
        this.ctrlBtn('[["#btnNuevo"],["#btnGuardar","#btnCancelar","#btnEditar","#btnEliminar"]]');
        // Recargar la lista de contactos
        this.recargarLista();
    })
    .catch(error => {
        console.error('Error en la solicitud DELETE:', error.message);
    });   
}
saveData = () =>{
        const frmRegistro = document.querySelector('#frmDataContacto');
        document.querySelector('#btnGuardar').addEventListener("click",(e) =>{
            const datos = Object.fromEntries(new FormData(frmRegistro).entries());
            postContacts(datos)
            .then(response => {
                // Verificar si la solicitud fue exitosa (código de respuesta en el rango 200)
                if (response.ok) {
                    return response.json(); // Devolver la respuesta como JSON
                } else {
                    // Si la respuesta no fue exitosa, lanzar una excepción
                    throw new Error(`Error en la solicitud POST: ${response.status} - ${response.statusText}`);
                }
            })
            .then(responseData => {
                // Hacer algo con la respuesta exitosa si es necesario
                console.log('Contacto creado exitosamente:', responseData);
                this.viewData(responseData.id);
                // Recargar la lista de contactos
                this.recargarLista();
            })
            .catch(error => {
                console.error('Error en la solicitud POST:', error.message);
                // Puedes manejar el error de otra manera si es necesario
            });
            this.ctrlBtn(e.target.dataset.ed);
            e.stopImmediatePropagation();
            e.preventDefault();
        })
}
viewData = (id)=>{
    const idView = document.querySelector('#idView');
    idView.innerHTML = id;
}
disableFrm = (estado) =>{
    let frm={
        nombreContacto: '', 
        apellidoContacto: '', 
        nroCelular: '', 
        emailContacto: '', 
        nroResidencia: ''
    }
        const frmRegistro = document.querySelector('#frmDataContacto');
        let myFrm = new FormData();
        Object.entries(ContactModel).forEach(([key, value]) => myFrm.append(key, value));
        myFrm.forEach((value, key) => {
             frmRegistro.elements[key].value= value;
             frmRegistro.elements[key].disabled = estado;
        })
    }
}
customElements.define("reg-contacto", RegContacto);