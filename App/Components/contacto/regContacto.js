export class RegContacto extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.saveData();
    this.enabledBtns();
    this.disableFrm(true);
  }

  render() {
    this.innerHTML = /* html */ `
      <style rel="stylesheet">
        @import "./App/Components/contacto/contactoStyle.css";
      </style>
        <div class="card mt-3">
            <div class="card-header">
                Registro de productos
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
                                <a href="#" class="btn btn-primary"  id="btnNuevo" data-ed='[["#btnGuardar","#btnCancelar"],["#btnNuevo","#btnEditar","#btnEliminar"]]'>Nuevo cliente</a>
                                <a href="#" class="btn btn-dark " id="btnCancelar" data-ed='[["#btnNuevo"],["#btnGuardar","#btnEditar","#btnEliminar","#btnCancelar"]]'>Cancelar registro</a>
                                <a href="#" class="btn btn-success" id="btnGuardar" data-ed='[["#btnEditar","#btnCancelar","#btnNuevo","#btnEliminar"],["#btnGuardar"]]'>Guardar cliente</a>
                                <a href="#" class="btn btn-warning" id="btnEditar" data-ed='[[],[]]'>Editar cliente</a>
                                <a href="#" class="btn btn-danger" id="btnEliminar" data-ed='[["#btnNuevo"],["#btnGuardar","#btnEditar","#btnEliminar","#btnCancelar"]]'>Eliminar cliente</a>
                            </div>
                        </div>
                    </div> 
                </form>
            </div>
        </div>
      `;
      this.querySelector("#btnNuevo").addEventListener("click",(e) =>{
        this.ctrlBtn(e.target.dataset.ed);
        this.disableFrm(false);
      })
      this.querySelector("#btnCancelar").addEventListener("click",(e) =>{
        this.ctrlBtn(e.target.dataset.ed);
        this.disableFrm(true);
      })
  }
ctrlBtn = (e) =>{
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
enabledBtns =() =>{
    document.querySelectorAll(".btn").forEach((val, id) => {
        this.ctrlBtn(val.dataset.ed);
    })
}
saveData = () =>{
        const frmRegistro = document.querySelector('#frmDataContacto');
        document.querySelector('#btnGuardar').addEventListener("click", (e) =>{
            const datos = Object.fromEntries(new FormData(frmRegistro).entries());
            console.log(datos)
            //postProducts(datos);
            e.stopImmediatePropagation();
            e.preventDefault();
        })
        // this.enabledBtns()
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
        Object.entries(frm).forEach(([key, value]) => myFrm.append(key, value));
        myFrm.forEach((value, key) => {
             frmRegistro.elements[key].value= value;
             frmRegistro.elements[key].disabled = estado;
        })
    }
}


customElements.define("reg-contacto", RegContacto);