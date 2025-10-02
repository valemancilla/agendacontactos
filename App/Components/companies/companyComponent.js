import './lstCompany.js';
import './regCompany.js';

export class CompanyComponent extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    render() {
        this.innerHTML = /* html */ `
            <style rel="stylesheet">
                @import "./App/Components/companies/companyStyle.css";
            </style>
            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a class="nav-link active mncompany" aria-current="page" href="#" data-verocultar='["#regCompany",["#lstCompany"]]'>Registrar Empresa</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link mncompany" href="#" data-verocultar='["#lstCompany",["#regCompany"]]'>Listado de Empresas</a>
                </li>
            </ul>
            <div class="container" id="regCompany" style="display:block;">
                <reg-company></reg-company>
            </div>
            <div class="container" id="lstCompany" style="display:none;">
                <lst-company></lst-company>
            </div>    
        `;
        this.querySelectorAll(".mncompany").forEach((val, id) => {
            val.addEventListener("click", (e) => {
                let data = JSON.parse(e.target.dataset.verocultar);
                let cardVer = document.querySelector(data[0]);
                cardVer.style.display = 'block';
                data[1].forEach(card => {
                    let cardActual = document.querySelector(card);
                    cardActual.style.display = 'none';
                });

                // Recargar listado cuando se hace clic en la pestaña
                if (data[0] === '#lstCompany') {
                    const lstCompany = document.querySelector('lst-company');
                    if (lstCompany) {
                        lstCompany.loadCompanies();
                    }
                }

                e.stopImmediatePropagation();
                e.preventDefault();
            })
        });
    }
}

customElements.define('company-component', CompanyComponent);
